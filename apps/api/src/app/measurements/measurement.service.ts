import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Measurement.name) private readonly measurementModel: Model<Measurement>
  ) {}

  /**
   * Save or update client measurements
   */
  async create(
    dto: CreateMeasurementDto,
  ) {
    try {
      //const { client, user, measurements, notes } = dto;

      // Convert standard JS object to a Map for Mongoose
      const measurementsMap = new Map(Object.entries(dto.measurements!));

      // Atomically update if exists, or insert if new (upsert)
      const newRecord = new this.measurementModel(dto);

      const client = await this.clientModel.findById(dto.client);
      const user = await this.userModel.findById(dto.user);
      
      if(client) newRecord.client = client;
      if(user) newRecord.user = user;       
      if(dto.notes) newRecord.notes = dto.notes;

      newRecord.measurements = measurementsMap;

      newRecord.save();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Measurement added successfully.',
        data: newRecord
      };

      return res;
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw new InternalServerErrorException('Failed to save client measurements');
    }
  }

  /**
   * Get measurement by Client ID
   */
  async findOne(id: string): Promise<IResponse<Measurement>> {
    try {
      const record = await this.measurementModel.findOne({
        'client._id': id,
      });

      if (!record) {
        throw new NotFoundException(`No measurements found for this client`);
      }

      const res: IResponse<Measurement> = {
        statusCode: 200,
        msg: 'Measurement retrieved successfully.',
        data: record
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
      const measurements = await this.measurementModel.find({ owner: id });

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
      const client = await this.clientModel.findById(updateMeasurementDto.client);
      const user = await this.userModel.findById(updateMeasurementDto.user);
      
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
            ...(updateMeasurementDto.notes && { updateMeasurementDto }),
          } 
        },
        { returnDocument: "after", upsert: true, runValidators: true }
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
}
