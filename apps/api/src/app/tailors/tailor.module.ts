import { Module } from '@nestjs/common';
import { TailorService } from './tailor.service';
import { TailorController } from './tailor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tailor, TailorSchema } from './schemas/tailor.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Tailor.name, schema: TailorSchema }
  ])],
  controllers: [TailorController],
  providers: [TailorService],
  exports: [MongooseModule]
})
export class TailorModule {}
