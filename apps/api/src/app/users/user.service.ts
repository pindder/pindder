import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AccountTypes, IResponse } from '@pindder/contracts';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { generateCode } from '../shared/helpers';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel(createUserDto);
      createdUser.firstname = createUserDto.fullname.split(' ')[0];
      createdUser.lastname = createUserDto.fullname.split(' ')[1];
      createdUser.referralCode = generateCode(6, true);
      createdUser.accountType = AccountTypes.USER;
      createdUser.username = createUserDto.email.split('@')[0];
      await createdUser.save();      

      this.eventEmitter.emit('accountCreated', { id: createdUser._id, user: createdUser.toObject() });
      this.eventEmitter.emit('accountVerificationSuccess', { user: createdUser.toObject() });

      const res: IResponse<User> = {
        statusCode: 200,
        msg: "Your account was created successfully!",
        data: createdUser
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find().exec();

      const res: IResponse<User[]> = {
        statusCode: 200,
        msg: 'List of customers',
        data: users
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
