import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { JwtService } from '@nestjs/jwt';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SharedModule } from '../shared/shared.module';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';
import { LedgerModule } from '../ledger/ledger.module';
import { StripeService } from './stripe.service';
import { PaystackService } from './paystack.service';
import { Plan, PlanSchema } from '../plans/schema/plan.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { StripeAccount, StripeAccountSchema } from './schemas/stripe-account';
import { Brand, BrandSchema } from '../brands/schemas/brand.schema';
import { Transaction, TransactionSchema } from './schemas/transaction';
import { FlutterwaveService } from './flutterwave.service';
import { Bank, BankSchema } from './schemas/bank';
import { BankDetail, BankDetailSchema } from '../bank-details/schema/bank-detail.schema';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Tailor.name, schema: TailorSchema },
      { name: Client.name, schema: ClientSchema },
      { name: User.name, schema: UserSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Bank.name, schema: BankSchema },
      { name: BankDetail.name, schema: BankDetailSchema },
      { name: StripeAccount.name, schema: StripeAccountSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    LedgerModule,
    SharedModule,
  ],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [
    PaymentService,
    JwtService,
    StripeService,
    PaystackService,
    FlutterwaveService,
  ],
  exports: [MongooseModule, PaymentService, StripeService, PaystackService, FlutterwaveService],
})
export class PaymentModule {}
