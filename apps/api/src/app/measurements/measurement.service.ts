import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(createMeasurementDto: CreateMeasurementDto) {
    const measurement = new this.measurementModel(createMeasurementDto);

    await measurement.save();
    return measurement;
  }

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

  findOne(id: number) {
    return `This action returns a #${id} measurement`;
  }

  update(id: number, updateMeasurementDto: UpdateMeasurementDto) {
    return `This action updates a #${id} measurement`;
  }

  remove(id: number) {
    return `This action removes a #${id} measurement`;
  }
}
