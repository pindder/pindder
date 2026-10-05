import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';
import { Quote, QuoteSchema } from './schemas/quote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tailor.name, schema: TailorSchema },
      { name: Quote.name  , schema: QuoteSchema }
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
