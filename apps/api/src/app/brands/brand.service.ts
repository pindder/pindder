import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schemas/brand.schema';
import { Model } from 'mongoose';
import { Client } from '../clients/schemas/client.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    const createdBrand = new this.brandModel(createBrandDto);
    await createdBrand.save();

    return createdBrand;
  }

  async brandReferrals(id: string) {
    const referrals = await this.clientModel.find({ referee: id }).limit(10);

    if(referrals.length < 1) {
      throw new HttpException('You have no referrals', HttpStatus.NO_CONTENT);
    }

    return referrals;
  }

  findAll() {
    const brands = this.brandModel.find().exec();
    return brands;
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id);

    if(!brand) {
      throw new HttpException('', HttpStatus.NOT_FOUND);
    }
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
