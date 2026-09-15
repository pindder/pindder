import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SharedService } from './shared.service';
import { TokenModule } from '../tokens/token.module';

@Module({
  providers: [SharedService, EmailService],
  exports: [SharedService, EmailService],
  imports: [TokenModule],
})
export class SharedModule {}
