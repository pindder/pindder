import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SharedService } from './shared.service';
import { TokenModule } from '../tokens/token.module';
import { RedisService } from './redis.service';
import { PaystackService } from './paystack.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { SeederService } from './seeder.service';
import { PlanModule } from '../plans/plan.module';
import { CloudinaryService } from './cloudinary-service.service';
import { StreamerService } from './streamer.service';
import { StreamsController } from './streams.controller';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }, { name: Tailor.name, schema: TailorSchema }]),
    PlanModule,
    TokenModule,
  ],
  providers: [
    SharedService,
    EmailService,
    RedisService,
    PaystackService,
    SeederService,
    CloudinaryService,
    StreamerService,
  ],
  exports: [
    SharedService,
    EmailService,
    PaystackService,
    StreamerService,
    HttpModule,
    RedisService,
    CloudinaryService,
  ],
  controllers: [StreamsController],
})
export class SharedModule {}
