import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../shared/redis.service';
import { PaystackService } from '../shared/paystack.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema }
    ])
  ],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService, JwtService, RedisService, PaystackService],
})
export class PaymentModule {}
