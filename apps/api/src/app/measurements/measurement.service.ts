import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Measurement } from './schemas/measurement.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';
import { Client } from '../clients/schemas/client.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class MeasurementService {
  private logger = new Logger(MeasurementService.name);

  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Measurement.name) private readonly measurementModel: Model<Measurement>
  ) {}

  /**
   * Save or update client measurements
   */
  async create(dto: CreateMeasurementDto) {
    try {
      const measurementsMap = new Map(Object.entries(dto.measurements || {}));

      if (measurementsMap.size === 0) {
        return;
      }

      let client; 
      
      client = await this.clientModel.findById(dto.owner).lean();
      
      if(!client) {
        client = await this.userModel.findById(dto.owner).lean();
      }
    
      if (!client) {
        return;
      }

      const newRecord = await this.measurementModel.create({
        name: dto.name,
        description: dto.description,
        notes: dto.notes, 
        measurements: measurementsMap,
        owner: client
      });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Measurement added successfully.',
        data: newRecord,
      };

      return res;
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw new InternalServerErrorException('Failed to save client measurements');
    }
  }

  /**
   * Save multiple client measurements at once
   */
  async createBulkMeasurements(measurements: CreateMeasurementDto[]) {
    try {
      const measurementList = await this.measurementModel.insertMany(measurements);

      if(!measurementList) {
        this.logger.log('Failed to save measurements:');
      }

      return measurementList;
    } catch(error: any) {
      this.logger.error('Failed to save client measurements:', error);
      return;    
    }
  }

  /**
   * Get measurement by Client ID
   */
  async findClientMeasurements(id: string): Promise<IResponse<Measurement[]>> {
    try {
      const records = await this.measurementModel.find({
        'owner._id': id,
      }).sort({ createdAt: -1 });

      if (!records) {
        throw new NotFoundException(`No measurements found for this client`);
      }

      const res: IResponse<Measurement[]> = {
        statusCode: 200,
        msg: 'Measurement retrieved successfully.',
        data: records
      }

      return res;  
    } catch(error: any) {
      if(error instanceof NotFoundException) {
        throw new NotFoundException(`No measurements found for this client`);
      }
      
      throw new InternalServerErrorException(`${error}`);
    }
  }

  // async create(createMeasurementDto: CreateMeasurementDto) {
  //   try {
  //     const measurement = new this.measurementModel(createMeasurementDto);

  //   await measurement.save();
  //   return measurement;
  //   } catch(error: any) {
  //     throw new InternalServerErrorException(`${error}`);
  //   }
  // }

  async findAll() {
    try {
      const measurements = await this.measurementModel.find().limit(10);

      if(measurements.length < 1) {
        throw new HttpException('No measurements found!', HttpStatus.NO_CONTENT)
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of Measurements',
        data: measurements
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findMyMeasurements(id: string) {
    try {
      const measurements = await this.measurementModel.find({ 'owner._id': id });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Measurement Data',
        data: measurements
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} measurement`;
  // }

  async update(id: string, updateMeasurementDto: UpdateMeasurementDto) {
    try {
      const client = await this.clientModel.findById(updateMeasurementDto.owner);
      const user = await this.userModel.findById(updateMeasurementDto.owner);
      
      // Convert standard JS object to a Map for Mongoose
      const measurementsMap = new Map(Object.entries(updateMeasurementDto.measurements!));

      // Atomically update if exists, or insert if new (upsert)
      const updatedRecord = await this.measurementModel.findOneAndUpdate(
        { _id : id },
        { 
          $set: { 
            ...(user && { user: user }),
            ...(client && { client: client }),
            measurements: measurementsMap,
            name: updateMeasurementDto.name,
            description: updateMeasurementDto.description,
            notes: updateMeasurementDto.notes,
            // ...(updateMeasurementDto.name && { updateMeasurementDto }),
          } 
        },
        { returnDocument: "after", upsert: true }
      );

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Measurement updated successfully.',
        data: updatedRecord
      }

      return res;
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw new InternalServerErrorException('Failed to save client measurements');
    }
  }

  async remove(id: string) {
    try {
      const measurement = await this.measurementModel.findByIdAndDelete(id);

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Measurement deleted successfully.',
        data: measurement
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async bulkDelete(clientId: string) {
    try {
      const deleted = await this.measurementModel.deleteMany({ 'owner._id': clientId });

      if(!deleted) {
        this.logger.log('Failure while deleting client measurments');
        return;
      }

      return;
    } catch(error: any) {
      this.logger.error(error);
      return;
    }
  }
}
