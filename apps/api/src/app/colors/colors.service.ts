import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './schema/color.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IResponse } from '../../../../../packages/contracts/src/lib/generic.types';

@Injectable()
export class ColorsService {
  constructor(
    @InjectModel(Color.name) private readonly colorModel: Model<Color>
  ) {}
  async create(createColorDto: CreateColorDto) {
    try {
      const newColor = new this.colorModel(createColorDto);
      return await newColor.save();
    } catch(error: any) {
      console.log(error);
      return error;
    }
  }

  async bulkCreate(createColorDto: CreateColorDto[]) {
    try {
      const newColors = await this.colorModel.insertMany(createColorDto);
      return newColors;
    } catch(error: any) {
      console.log(error);
      return error;
    }
  }

  async findAll() {
    try {
      const colors = await this.colorModel.find();

      const res: IResponse<Color[]> = {
        data: colors,
        msg: 'Colors fetched successfully',
        statusCode: 200,
      };

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findOne(id: number) {
    return await this.colorModel.findById(id);
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    return await this.colorModel.findByIdAndUpdate(id, updateColorDto, { returnDocument: 'after' });
  }

  async remove(id: string) {
    return await this.colorModel.findByIdAndDelete(id);
  }
}
