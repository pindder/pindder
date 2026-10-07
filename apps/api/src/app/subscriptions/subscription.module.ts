import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema }
    ])
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, JwtService],
})
export class SubscriptionModule {}
