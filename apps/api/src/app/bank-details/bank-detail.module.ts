import { Module } from '@nestjs/common';
import { BankDetailService } from './bank-detail.service';
import { BankDetailController } from './bank-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetail, BankDetailSchema } from './schema/bank-detail.schema';
import { TailorModule } from '../tailors/tailor.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankDetail.name, schema: BankDetailSchema }
    ]),
    TailorModule
  ],
  controllers: [BankDetailController],
  providers: [BankDetailService],
  exports: [MongooseModule, BankDetailService]
})
export class BankDetailModule {}
