import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BrandModule } from '../brands/brand.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from '../clients/client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '../shared/email.service';
import { TailorModule } from '../tailors/tailor.module';
import { TokenModule } from '../tokens/token.module';
import { SharedService } from '../shared/shared.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],      
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('AUTH_SECRET'),
        // signOptions: { expiresIn: '1h' },
        verifyOptions: { ignoreExpiration: false },
      })
    }),
    ClientModule,
    UserModule, 
    TailorModule,
    BrandModule,
    TokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, SharedService],
  exports: [JwtModule]
})
export class AuthModule {}
