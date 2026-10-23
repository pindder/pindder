import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from '../clients/client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TailorModule } from '../tailors/tailor.module';
import { TokenModule } from '../tokens/token.module';
import { SharedModule } from '../shared/shared.module';
import { PaymentModule } from '../payments/payment.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';
import { AdminModule } from '../admins/admin.module';

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
    AdminModule,
    ClientModule,
    UserModule, 
    TailorModule,
    TokenModule,
    SharedModule,
    PaymentModule,
    SubscriptionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule {}
