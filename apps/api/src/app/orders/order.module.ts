import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { JwtService } from '@nestjs/jwt';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { NotificationModule } from '../notifications/notification.module';
import { UserModule } from '../users/user.module';
import { TailorModule } from '../tailors/tailor.module';
import { ClientModule } from '../clients/client.module';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Quote.name  , schema: QuoteSchema }
    ]),
    TailorModule,
    ClientModule,
    UserModule,
    PaymentModule
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
  exports: [MongooseModule, OrderService]
})
export class OrderModule {}
