import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Design } from './schemas/design.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';

@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name) private readonly designModel: Model<Design>
  ) {}
  async create(createDesignDto: CreateDesignDto, acct_id: string) {
    try {
      const newDesign = new this.designModel(createDesignDto);
      newDesign.owner = acct_id;

      await newDesign.save();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Your style was added successfully.',
        data: newDesign
      };

      return res;
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
  }

  async search(query: string, user_id: string) {
    try {
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitizedQuery, 'i');

      const designs = await this.designModel.find({
        $or: [
          { name: searchRegex },
        ],
        $and: [
          {
            owner: user_id
          }
        ]
      }).exec();

      return designs;

    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findOne(id: string) {
    try {
      const design = await this.designModel.findById(id);

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Design retrieval successful.',
        data: design
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  update(id: number, updateDesignDto: UpdateDesignDto) {
    return `This action updates a #${id} design`;
  }

  async remove(id: string) {
    try {
      const design = await this.designModel.findByIdAndDelete(id);

      const res: IResponse<any> = {
        statusCode: 200,
        msg: `You have successfully deleted the ${design?.name} style.`,
        data: design
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
