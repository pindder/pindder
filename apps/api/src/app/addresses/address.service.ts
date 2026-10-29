import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './schema/address.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';
import { Brand } from '../brands/schemas/brand.schema';

@Injectable()
export class AddressService {
  private logger = new Logger(AddressService.name);

  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>
  ) {}

  async create(createAddressDto: CreateAddressDto, user_id: string) {
    try {
      const brand = await this.brandModel.findOne({ 'admin._id': user_id }).exec();

      if(!brand) {
        return new NotFoundException(`Please create your business on pindder to add location.`)
      }

      const address = new this.addressModel(createAddressDto);

      if(brand) address.brand = brand._id;

      await address.save();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Addresss added successfully.',
        data: address
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const addresses = await this.addressModel.find().sort({ createdAt: -1 }).limit(20);

      if(!addresses) {
        throw new NotFoundException(`No address was found in the database.`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of addresses',
        data: addresses
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try{
      const addresses = await this.addressModel.find({ brand: id })

      if(!addresses) {
        throw new NotFoundException(`No address was found for this account!`);
      }

      const res: IResponse<any[]> = {
        statusCode: 200, 
        msg: 'List of addresses for this account.',
        data: addresses
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    try {
      const address = await this.addressModel.findByIdAndUpdate(id, updateAddressDto, { returnDocument: 'after', upsert: true });

      if(!address) {
        throw new NotFoundException('Address not found!');
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Address updated successfully.',
        data: address
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
