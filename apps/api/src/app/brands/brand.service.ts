import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schemas/brand.schema';
import { Model } from 'mongoose';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { AccountStatus, IResponse } from '@pindder/contracts';

@Injectable()
export class BrandService {
  private logger = new Logger(BrandService.name);

  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>
  ) {}
  async create(createBrandDto: CreateBrandDto, user: unknown) {
    try {
      const tailor = await this.tailorModel.findById(user);

      if(!tailor) {
        throw new NotFoundException(`Account not found!`);
      }

      if(tailor && tailor.status === AccountStatus.SUSPENDED) {
        throw new NotAcceptableException(`This account cannot create a brand at this time. Please contact admin for support!`);
      }

      const createdBrand = new this.brandModel(createBrandDto);
      if(!createBrandDto.email) {
        createdBrand.email = tailor.email;
      }
      createdBrand.admin = tailor._id;
      
      await createdBrand.save();

      const res: IResponse<Brand> = {
        statusCode: 200,
        msg: 'Congratulations! Your brand is now on pindder.',
        data: createdBrand
      };

      return res;
    } catch(error: unknown) {
      console.log(error, typeof error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const [brands, totalBrands] = await Promise.all([
        this.brandModel
        .find()
        .limit(20)
        .sort({ createdAt: -1 })
        .exec(),
        this.brandModel.countDocuments()
      ]);

      if(brands.length === 0) {
        throw new NotFoundException()
      }

      const res: IResponse<any[]> = {
        statusCode: 200,
        msg: 'List of available brands on pindder',
        data: brands,
        meta: {
          limit: 20,
          totalPages: totalBrands / 20,
          hasNextPage: true,
          hasPreviousPage: true,
          total: totalBrands,
          page: 1
        }
      };

      return res;
    } catch(error: unknown) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const brand = await this.brandModel.findOne({ admin: id }).select('-__v').exec();

      if(!brand) {
        throw new HttpException('', HttpStatus.NOT_FOUND);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: "Business details",
        data: brand
      };

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.brandModel.findByIdAndUpdate(id, updateBrandDto, { returnDocument: 'after', upsert: true });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Business details updated successfully.',
        data: brand
      };

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
