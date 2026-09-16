import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Design } from './schemas/design.schema';
import { Model } from 'mongoose';

@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name) private readonly designModel: Model<Design>
  ) {}
  async create(createDesignDto: CreateDesignDto, acct_id: string) {
    try {
      const newDesign = new this.designModel(createDesignDto);
      newDesign.owner = acct_id;

      await newDesign.save()

      return newDesign;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findAll(acct_id: string) {
    try {
      const designs = await this.designModel.find({ owner: acct_id });

      return designs;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
    return `This action returns all design`;
  }

  findOne(id: number) {
    return `This action returns a #${id} design`;
  }

  update(id: number, updateDesignDto: UpdateDesignDto) {
    return `This action updates a #${id} design`;
  }

  remove(id: number) {
    return `This action removes a #${id} design`;
  }
}
