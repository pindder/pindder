import { Module } from '@nestjs/common';
import { BankDetailService } from './bank-detail.service';
import { BankDetailController } from './bank-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetail, BankDetailSchema } from './schema/bank-detail.schema';
import { TailorModule } from '../tailors/tailor.module';
import { Bank, BankSchema } from '../payments/schemas/bank';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankDetail.name, schema: BankDetailSchema },
      { name: Bank.name, schema: BankSchema },
    ]),
    TailorModule,
    PaymentModule
  ],
  controllers: [BankDetailController],
  providers: [BankDetailService],
  exports: [MongooseModule, BankDetailService]
})
export class BankDetailModule {}
