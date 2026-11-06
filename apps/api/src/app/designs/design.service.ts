import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Design } from './schemas/design.schema';
import { Model } from 'mongoose';
import { AccountTypes, DataTypes, DataTypesIcon, IResponse, NotificationActions } from '@pindder/contracts';
import { NotificationService } from '../notifications/notification.service';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { User } from '../users/schemas/user.schema';
import { CloudinaryService } from '../shared/cloudinary-service.service';

@Injectable()
export class DesignService {
  private logger = new Logger(DesignService.name);
  
  constructor(
    @InjectModel(Design.name) private readonly designModel: Model<Design>,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationService: NotificationService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(createDesignDto: CreateDesignDto, user: any) {
    try {
      const newDesign = new this.designModel(createDesignDto);

      if(user.acctType === AccountTypes.TAILOR) {
        const tailor = await this.tailorModel.findById(user.sub);
        if(!tailor) {
          throw new UnauthorizedException();
        }

        newDesign.owner = tailor._id;

      } else if(user.acctType === AccountTypes.USER) {
        const customer = await this.userModel.findById(user.sub);
        if(!customer) {
          throw new UnauthorizedException();
        }

        newDesign.owner = customer._id;
      }

      await newDesign.save();

      await this.notificationService.create({
        initiator: newDesign.owner,
        dependent: null,
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

  async findAll(user: any, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit; 

      const [designs, totalDesigns] = await Promise.all([
        this.designModel
          .find({ owner : user.sub })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        this.designModel.countDocuments({ $or: [ {owner: user.sub }]})
      ]);

      const res: IResponse<any[]> = {
        statusCode: 200,
        msg: 'List of styles',
        data: designs,
        meta: {
          limit: limit,
          page: page,
          total: totalDesigns,
          hasNextPage: page * limit <=  totalDesigns ? true : false,
          hasPreviousPage: page > 1 ? true : false,
          totalPages: totalDesigns > limit ? totalDesigns / limit : page
        }
      }

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findCatalogs(id: string) {
    try{
      const tailor = await this.tailorModel.findOne({ username: id });

      if(!tailor) {
        throw new NotFoundException(`No designer found with username: ${id}`);
      }

      const catalogs = await this.designModel.find({ owner: tailor._id, catalogDisplay: true }).sort({ createdAt: -1 });

      if(!catalogs || catalogs.length === 0) {
        throw new NotFoundException(`No catalog found for this designer`);
      }

      const res: IResponse<any[]> = {
        statusCode: 200,
        msg: `List of ${id} catalogs`,
        data: catalogs
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
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
            owner : user_id
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

  async removeDesignImage(id: string, imgUrl: string) {
    try {
      // 1. Await the database query
      const design = await this.designModel.findById(id);

      if (!design) {
        throw new NotFoundException(`Style not found!`);
      }

      // 2. Extract public ID from the stored URL
      const publicId = this.cloudinaryService.extractPublicIdFromUrl(imgUrl);

      // 3. Delete from Cloudinary
      await this.cloudinaryService.deleteImage(publicId);

      // 4. Remove ONLY this specific image URL from the 'images' array in MongoDB
      await this.designModel.findByIdAndUpdate(id, {
        $pull: { images: imgUrl },
      });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'image deleted successfully!',
      }

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }
}
