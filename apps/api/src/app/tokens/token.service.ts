import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>
  ) {}
  create(createTokenDto: CreateTokenDto) {
    return 'This action adds a new token';
  }

  async findAll() {
    try {
      const tokens = await this.tokenModel.find().limit(20).exec();

      if(!tokens) {
        throw new NotFoundException(``);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of tokens',
        data: tokens
      };
      
      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
