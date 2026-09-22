import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SharedService } from './shared.service';
import { TokenModule } from '../tokens/token.module';
import { RedisService } from './redis.service';
import { PaystackService } from './paystack.service';

@Module({
  providers: [SharedService, EmailService, RedisService, PaystackService],
  exports: [SharedService, EmailService],
  imports: [TokenModule],
})
export class SharedModule {}
