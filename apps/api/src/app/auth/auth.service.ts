import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { EmailService } from '../shared/email.service';
import { CreateTailorDto } from '../tailors/dto/create-tailor.dto';
import { AccountStatus, AccountTypes, IResponse, IVerification, TokenTypes } from '@pindder/contracts';
import { SharedService } from '../shared/shared.service';
import { PaystackService } from '../shared/paystack.service';
import { generateCode } from '../shared/helpers';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { Admin } from '../admins/schemas/admin.schema';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly jwtService: JwtService,
    private readonly paystackService: PaystackService,
    private readonly emailService: EmailService,
    private readonly sharedService: SharedService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  async adminLogin(loginDto: LoginDto) {
    try {
      const admin = await this.adminModel.findOne({
        email: loginDto.email
      }).lean();

      if(!admin) {
        throw new UnauthorizedException();
      }

      const {password, ...adminData} = admin;

      const matched = await this.sharedService.comparePassword(loginDto.password, password);

      if(!matched) {
        throw new UnauthorizedException();
      }

      // generate payload for token
      const payload = { sub: admin._id, roles: admin.roles, email: admin.email, acctType: AccountTypes.ADMIN }

      // sign tokens
      const auth_token = await this.jwtService.signAsync(payload);

      const token = await this.sharedService.createToken(
        AccountTypes.ADMIN, 
        admin._id, 
        TokenTypes.JWT
      );

      if(!token) {
        throw new HttpException('Failed to generate access token!', HttpStatus.EXPECTATION_FAILED);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Admin Logged in successfully!',
        data: {...adminData, token: auth_token}
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async tailorLogin(loginDto: LoginDto) {
    try {
      let token;
      const tailor = await this.tailorModel.findOne({ email: loginDto.email });

      // 1. Pass an explicit, meaningful message instead of ''
      if (!tailor) {
        throw new UnauthorizedException('Invalid email or account does not exist');
      }

      const hasToken = await this.sharedService.hasValidToken(tailor._id);

      if (hasToken) {
        token = await this.sharedService.updateToken(tailor.id, TokenTypes.CODE);
      } else {
        token = await this.sharedService.createToken(
          AccountTypes.TAILOR, 
          tailor.id, 
          TokenTypes.CODE
        );
      }
      
      await this.emailService.sendOneTimeLoginCode(tailor, token.token);

      return { status: 200, message: 'Login code has been sent to your email!' };
      
    } catch (error) {
      // 2. Re-throw known NestJS HTTP exceptions so they keep their status code & message
      if (error instanceof HttpException) {
        throw error;
      }

      // 3. Log unknown database/system errors and return a 500
      console.error('tailorLogin error:', error);
      throw new InternalServerErrorException('An error occurred while logging in');
    }
  }

  async tailorRegistration(tailorRegistrationDto: CreateTailorDto) {
    try {
      let tailor = await this.tailorModel.findOne({ email: tailorRegistrationDto.email });

      if(tailor) {
        throw new HttpException('A user already exists with the provided email', HttpStatus.CONFLICT);
      }

      tailor = new this.tailorModel(tailorRegistrationDto);
      tailor.firstname = tailorRegistrationDto.fullname.split(' ')[0];
      tailor.lastname = tailorRegistrationDto.fullname.split(' ')[1];
      tailor.username = tailorRegistrationDto.email.split('@')[0];
      tailor.accountType = AccountTypes.TAILOR;
      tailor.tel = tailorRegistrationDto.tel;
      tailor.countryCode = tailorRegistrationDto.countryCode;
      tailor.referralCode = generateCode(8, true);
      await tailor.save();

      // await this.emailService.sendWelcomeEmail(tailor.email, tailor.username);
      const token = await this.sharedService.createToken(AccountTypes.TAILOR, tailor._id, TokenTypes.CODE);

      await this.emailService.sendOneTimeLoginCode(tailor, token.token);

      const res: IResponse<Tailor> = {
        statusCode: 200,
        msg: `Account created successfully!`,
        data: tailor,
      };

      return res;
    } catch(error: any) {
      console.error(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async userLogin(loginDto: LoginDto) {
    // Implementation for user login
    try{
      let token;
      const user = await this.userModel.findOne({ email: loginDto.email });

      if(!user) {
        throw new NotFoundException('User not found');
      }

      const hasToken = await this.sharedService.hasValidToken(user._id);

      if(hasToken) {
        token = await this.sharedService.updateToken(user._id, TokenTypes.CODE);
      } else {
        token = await this.sharedService.createToken(AccountTypes.TAILOR, user._id, TokenTypes.CODE,);
      }
      
      this.emailService.sendOneTimeLoginCode(user, token.token);

      return { status: 200, message: `Login code has been sent to your email!` };
    } catch(error: any) {
      throw new InternalServerErrorException();
    }
  }

  async userRegistration(createUserDto: CreateUserDto) {
    // Implementation for user registration
    const user = new this.userModel({...createUserDto, referralCode: generateCode(8, true)});
    await user.save();

    this.emailService.sendWelcomeEmail(user.email, user.username);
    const token = await this.sharedService.createToken(AccountTypes.TAILOR, user._id, TokenTypes.CODE);

    this.emailService.sendOneTimeLoginCode(user, token.token);

    return { status: 200, data: user, message: `Account created successfully!` };

  }

  async verifyOneTimeLoginCode(data: IVerification) {
    try {
      //let payload;
      let acct;

      const token = await this.sharedService.findToken(data.code);

      // if token is not found throw an exception
      if(!token) {
        throw new NotFoundException();
      }

      // check for the associated acct on the token against all acctTypes
      if(token.accountType === AccountTypes.TAILOR) {
        acct = await this.tailorModel.findOne({ _id: token.tailor });
      } 
      else if(token.accountType === AccountTypes.USER) {
        acct = await this.userModel.findById(token.user);
      }

      // throw an error if the acct associated with the token could not be found
      if(!acct) throw new NotFoundException();

      // generate payload for token
      const payload = { sub: acct._id, username: acct.username, email: acct.email, acctType: acct.accountType }

      // sign tokens
      const auth_token = await this.jwtService.signAsync(payload);
      
      // update token and token type
      const result = await this.sharedService.updateToken(acct._id, TokenTypes.JWT, auth_token);
      
      // update acct status to ACTIVE From PENDING
      if(acct && acct.status == AccountStatus.PENDING) {
        acct.status = AccountStatus.ACTIVE;
        await acct.save();

        if(acct.accountType === AccountTypes.TAILOR) {
          await this.paystackService.createCustomer(acct);
          await this.emailService.sendWelcomeEmail(acct.email, acct.username!);
          await this.subscriptionService.assignSubscription(acct);
        }
      }

      return result;
    } catch(error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async resendToken(email: string, acctType: string) {
    let acct;

    try {
      switch (acctType) {
        case AccountTypes.TAILOR:
          acct = await this.tailorModel.findOne({ email: email });
          break;

        case AccountTypes.USER:
          acct = await this.userModel.findOne({ email: email });
          break;

        default:
          return `Account not found!`;
      }
      
      if(!acct) {
        return false;
      }

      const token = await this.sharedService.updateToken(acct._id, TokenTypes.CODE);

      await this.emailService.sendOneTimeLoginCode(acct, token.token);

      return true;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
