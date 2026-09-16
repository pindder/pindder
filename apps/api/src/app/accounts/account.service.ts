import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Brand } from '../brands/schemas/brand.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>
  ) {}

  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
  }

  findAll() {
    return `This action returns all account`;
  }

  async findOne(id: string) {
    try {
      let account = await this.tailorModel.findById(id);

      if(!account) {
        account = await this.userModel.findById(id);
      } 

      if(!account) {
        account = await this.brandModel.findById(id);
      }

      if(!account) {
        throw new UnauthorizedException();
      }

      return {
        status: 200,
        message: '',
        account: account
      }
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
