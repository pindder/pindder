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

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Tailor.name, schema: TailorSchema }
    ]),
    LedgerModule,
    SharedModule
  ],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService, JwtService],
  exports: [MongooseModule, PaymentService]
})
export class PaymentModule {}
