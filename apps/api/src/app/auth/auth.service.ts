import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Brand } from '../brands/schemas/brand.schema';
import { JwtService } from '@nestjs/jwt';
//import { Client } from '../clients/schemas/client.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { EmailService } from '../shared/email.service';
import { CreateTailorDto } from '../tailors/dto/create-tailor.dto';
import { AccountStatus, AccountTypes, IVerification, TokenTypes } from '@pindder/contracts';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly sharedService: SharedService,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    //@InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
    private readonly jwtService: JwtService,
  ) {}

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
        token = await this.sharedService.updateToken(tailor._id, TokenTypes.CODE);
      } else {
        token = await this.sharedService.createToken(
          AccountTypes.TAILOR, 
          tailor._id, 
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
      await tailor.save();

      await this.emailService.sendWelcomeEmail(tailor.email, tailor.username);
      const token = await this.sharedService.createToken(AccountTypes.TAILOR, tailor._id, TokenTypes.CODE);

      await this.emailService.sendOneTimeLoginCode(tailor, token.token);

      return { status: 200, data: tailor, message: `Account created successfully!` };
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
    const user = new this.userModel(createUserDto);
    await user.save();

    this.emailService.sendWelcomeEmail(user.email, user.username);
    const token = await this.sharedService.createToken(AccountTypes.TAILOR, user._id, TokenTypes.CODE);

    this.emailService.sendOneTimeLoginCode(user, token.token);

    return { status: 200, data: user, message: `Account created successfully!` };

  }

  async brandLogin(brandLoginDto: LoginDto) {
    // Implementation for brand login
    const brand = await this.brandModel.findOne({ email: brandLoginDto.email });

    if(!brand) {
      throw new NotFoundException('Brand not found');
    }

    const payload = { sub: brand._id, brand: brand.brandName };
    
    return {
      user: brand,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async brandRegistration(brandCreateDto: CreateBrandDto) {
    // Implementation for brand registration
    const brand = new this.brandModel(brandCreateDto);
    await brand.save();

    return brand;
  }

  async verifyOneTimeLoginCode(data: IVerification) {
    try {
      let payload;
      let acct;

      const token = await this.sharedService.findToken(data.code);

      // if token is not found throw an exception
      if(!token) {
        throw new NotFoundException();
      }

      // check for the associated acct on the token against all acctTypes
      if(token.accountType === AccountTypes.TAILOR) {
        acct = await this.tailorModel.findById(token.tailor);
      } 
      else if(token.accountType === AccountTypes.USER) {
        acct = await this.userModel.findById(token.user);
      }
      else if(token.accountType === AccountTypes.BRAND) {
        acct = await this.brandModel.findById(token.brand);
      }

      // throw an error if the acct associated with the token could not be found
      if(!acct) throw new NotFoundException();

      // generate payload for token
      payload = { sub: acct._id, username: acct.username, email: acct.email, acctType: acct.accountType }

      // sign tokens
      const auth_token = await this.jwtService.signAsync(payload);
      
      // update token and token type
      const result = await this.sharedService.updateToken(acct._id, TokenTypes.JWT, auth_token);
      
      // update acct status to ACTIVE From PENDING
      if(acct && acct.status == AccountStatus.PENDING) {
        acct.status = AccountStatus.ACTIVE;
        await acct.save();
      }

      return result;
    } catch(error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async resendToken() {
    
  }
}
