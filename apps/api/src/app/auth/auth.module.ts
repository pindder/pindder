import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BrandModule } from '../brands/brand.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule, BrandModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
