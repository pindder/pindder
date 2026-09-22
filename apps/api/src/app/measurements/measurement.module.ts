import { Module } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Measurement, MeasurementSchema } from './schemas/measurement.schema';
import { Design, DesignSchema } from '../designs/schemas/design.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Measurement.name, schema: MeasurementSchema },
      { name: Design.name, schema: DesignSchema }
    ])
  ],
  controllers: [MeasurementController],
  providers: [MeasurementService, JwtService],
  exports: [MongooseModule]
})
export class MeasurementModule {}
