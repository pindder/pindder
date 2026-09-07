import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [MongooseModule],
})
export class BrandModule {}
