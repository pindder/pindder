import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Measurement } from './schemas/measurement.schema';
import { Model } from 'mongoose';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectModel(Measurement.name) private readonly measurementModel: Model<Measurement>
  ) {}

  /**
   * Save or update client measurements
   */
  async create(
    dto: CreateMeasurementDto,
  ) {
    try {
      const { client, user, measurements, notes } = dto;

      // Convert standard JS object to a Map for Mongoose
      const measurementsMap = new Map(Object.entries(measurements!));

      // Atomically update if exists, or insert if new (upsert)
      const newRecord = new this.measurementModel();

      if(client) newRecord.client = client;
      if(user) newRecord.user = user;
      if(notes) newRecord.notes = notes;

      newRecord.measurements = measurementsMap;

      newRecord.save();

      return newRecord;
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw new InternalServerErrorException('Failed to save client measurements');
    }
  }

  /**
   * Get measurement by Client ID
   */
  async findOne(id: string): Promise<Measurement> {
    const record = await this.measurementModel.findOne({
      client: id,
    });

    if (!record) {
      throw new NotFoundException(`No measurements found for this client`);
    }

    return record;
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
    const measurements = await this.measurementModel.find().limit(10);

    if(measurements.length < 1) {
      throw new HttpException('No measurements found!', HttpStatus.NO_CONTENT)
    }

    return measurements;
  }

  async findMyMeasurements(id: string) {
    const measurements = await this.measurementModel.find({ owner: id });

    return measurements;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} measurement`;
  // }

  async update(id: number, updateMeasurementDto: UpdateMeasurementDto) {
    try {
      const { _id, client, user, measurements, notes } = updateMeasurementDto;

      // Convert standard JS object to a Map for Mongoose
      const measurementsMap = new Map(Object.entries(measurements!));

      // Atomically update if exists, or insert if new (upsert)
      const updatedRecord = await this.measurementModel.findOneAndUpdate(
        { _id : _id },
        { 
          $set: { 
            ...(user && { user: user }),
            ...(client && { client: client }),
            measurements: measurementsMap,
            ...(notes && { notes }),
          } 
        },
        { returnDocument: "after", upsert: true, runValidators: true }
      );

      return updatedRecord;
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw new InternalServerErrorException('Failed to save client measurements');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} measurement`;
  }
}
