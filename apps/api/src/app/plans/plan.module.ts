import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schema/plan.schema';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { StripeService } from '../payments/stripe.service';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { EmailService } from '../shared/email.service';
import { StripeAccount, StripeAccountSchema } from '../payments/schemas/stripe-account';
import { Brand, BrandSchema } from '../brands/schemas/brand.schema';
import { Transaction, TransactionSchema } from '../payments/schemas/transaction';
import { BankDetail, BankDetailSchema } from '../bank-details/schema/bank-detail.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Tailor.name, schema: TailorSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Client.name, schema: ClientSchema },
      { name: User.name, schema: UserSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: StripeAccount.name, schema: StripeAccountSchema },
      { name: BankDetail.name, schema: BankDetailSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ])
  ],
  controllers: [PlanController],
  providers: [PlanService, JwtService, StripeService, EmailService],
  exports: [MongooseModule, PlanService]
})
export class PlanModule {}
