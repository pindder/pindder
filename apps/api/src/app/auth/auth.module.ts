import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BrandModule } from '../brands/brand.module';
import { UserModule } from '../users/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule, 
    BrandModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
