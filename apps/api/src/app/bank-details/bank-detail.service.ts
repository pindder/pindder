import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BankDetail } from './schema/bank-detail.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';
import { Tailor } from '../tailors/schemas/tailor.schema';

@Injectable()
export class BankDetailService {
  private logger = new Logger(BankDetailService.name);

  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(BankDetail.name) private readonly bankModel: Model<BankDetail>
  ) {}

  async create(createBankDetailDto: CreateBankDetailDto, user: any) {
    try {
      const tailor = await this.tailorModel.findById(user.sub).lean();

      if(!tailor) {
        throw new NotFoundException(`User not found!`);
      }

      const newBank = new this.bankModel(createBankDetailDto);

      newBank.tailor = tailor;
      await newBank.save()

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Payout account added successfully',
        data: newBank
      };
      
      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async findAll() {
    try {
      const bankDetails = await this.bankModel.find();

      if(!bankDetails) {
        throw new NotFoundException(`No bank detail has been created!`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of Account Details',
        data: bankDetails
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const bankDetail = await this.bankModel.findById(id);

      if(!bankDetail) {
        throw new NotFoundException(`The account detail was not found!`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Account Detail',
        data: bankDetail
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async search(user: string) {
    try {
      const bankDetails = await this.bankModel.find({
        $or: [
          { 'tailor._id': user }
        ]
      }).lean();

      if(!bankDetails || bankDetails.length < 1) {
        throw new NotFoundException(`No matching detail found!`);
      }

      const res: IResponse<any[]> = {
        statusCode: 200,
        msg: 'List of banks',
        data: bankDetails
      }

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async update(id: string, updateBankDetailDto: UpdateBankDetailDto) {
    try {
      const bankDetail = await this.bankModel.findByIdAndUpdate(
        id, {...updateBankDetailDto},
        { returnDocument: 'after', new: true }
      );

      if(!bankDetail) {
        throw new NotFoundException(`Account detail not found!`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Account detail updated successfully!',
        data: bankDetail
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async remove(id: string) {
    try { 
      const bankDetail = await this.bankModel.findByIdAndDelete(id);

      if(bankDetail) {
        throw new NotFoundException(``);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Account deleted successfully!',
        data: bankDetail
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  } 
}
