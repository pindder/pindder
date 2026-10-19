import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';
import { JwtService } from '@nestjs/jwt';
import { TailorModule } from '../tailors/tailor.module';
import { PlanModule } from '../plans/plan.module';
import { PaymentModule } from '../payments/payment.module';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    TailorModule,
    PlanModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, JwtService],
  exports: [MongooseModule, SubscriptionService]
})
export class SubscriptionModule {}
