import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientSchema } from '../clients/schemas/client.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Brand.name, schema: BrandSchema },
    { name: Client.name, schema: ClientSchema }
  ])],
  controllers: [BrandController],
  providers: [BrandService, JwtService],
  exports: [MongooseModule],
})
export class BrandModule {}
