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
    ])
  ],
  controllers: [PlanController],
  providers: [PlanService, JwtService, StripeService],
  exports: [MongooseModule, PlanService]
})
export class PlanModule {}
