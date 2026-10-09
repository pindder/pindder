import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Design } from './schemas/design.schema';
import { Model } from 'mongoose';
import { AccountTypes, DataTypes, DataTypesIcon, IResponse, NotificationActions } from '@pindder/contracts';
import { NotificationService } from '../notifications/notification.service';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name) private readonly designModel: Model<Design>,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationService: NotificationService
  ) {}
  async create(createDesignDto: CreateDesignDto, user: any) {
    console.log(user);
    try {
      const newDesign = new this.designModel(createDesignDto);

      if(user.acctType === AccountTypes.TAILOR) {
        const tailor = await this.tailorModel.findById(user.sub);
        
        if(tailor) {
          newDesign.owner = await tailor;
        }
        else {
          throw new UnauthorizedException();
        }
      } else if(user.acctType === AccountTypes.USER) {
        const customer = await this.userModel.findById(user.sub);
        
        if(customer) {
          newDesign.owner = customer;
        } else {
          throw new UnauthorizedException();
        }
      }

      await newDesign.save();

      await this.notificationService.create({
        tailor: newDesign.owner,
        type: DataTypes.DESIGN,
        action: NotificationActions.STYLE_CREATED,
        icon: DataTypesIcon.DESIGN,
        title: 'New Style',
        message: `${newDesign.name} has been created.`,
        data: {
          ...newDesign,
        },
      });

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
      const designs = await this.designModel.find({ 'owner._id': acct_id }).sort({ createdAt: -1 });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of styles',
        data: designs
      }

      return res;
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
            'owner._id': user_id
          }
        ]
      }).exec();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of styles',
        data: designs
      }

      return res;

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

  async update(id: string, updateDesignDto: UpdateDesignDto) {
    try {
      const design = await this.designModel
      .findByIdAndUpdate(
        id,
        updateDesignDto, 
        { upsert: true, returnDocument: 'after'}
      );

      console.log('design', updateDesignDto);
      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Style updated successfully',
        data: design
      };

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async remove(id: string) {
    try {
      const design = await this.designModel.findByIdAndDelete(id);

      const res: IResponse<any> = {
        statusCode: 200,
        msg: `${design?.name} style deleted successfully.`,
        data: design
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
