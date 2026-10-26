import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schemas/brand.schema';
import { Model } from 'mongoose';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { AccountStatus } from '@pindder/contracts';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    const tailor = await this.tailorModel.findById(createBrandDto.tailor);

    if(!tailor) {
      throw new NotFoundException(`Account not found!`);
    }

    if(tailor && tailor.status === AccountStatus.SUSPENDED) {
      throw new NotAcceptableException(`This account cannot create a brand at this time. Please contact admin for support!`);
    }

    const createdBrand = new this.brandModel(createBrandDto);
    createdBrand.admin = tailor;
    
    await createdBrand.save();

    return createdBrand;
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
