import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';
import { SharedService } from '../shared/shared.service';


@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly sharedService: SharedService
  ) {}
  
  async create(createAdminDto: CreateAdminDto) {
    try {
      const newAdmin = new this.adminModel(createAdminDto);

      const hashedPassword = await this.sharedService.hashPassword(createAdminDto.password);

      newAdmin.password = hashedPassword;
      await newAdmin.save();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Admin account created successfully',
        data: newAdmin
      };  

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    return `This action returns all admin`;
  }

  async findOne(id: string) {
    try {
      const admin = await this.adminModel.findById(id);

      if(!admin) {
        throw new NotFoundException();
      }
      
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  async remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
