import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schema/address.schema';
import { BrandModule } from '../brands/brand.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Address.name, schema: AddressSchema }
    ]),
    BrandModule
  ],
  controllers: [AddressController],
  providers: [AddressService, JwtService],
})
export class AddressModule {}
