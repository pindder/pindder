import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brands/brand.module';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OrderModule } from './orders/order.module';
import { ClientModule } from './clients/client.module';
import { DesignModule } from './designs/design.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { AdminModule } from './admins/admin.module';
import { MeasurementModule } from './measurements/measurement.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('AUTH_SECRET'),
        secretOrPrivateKey: configService.getOrThrow<string>('AUTH_SECRET'),
        signOptions: { expiresIn: '1h' },
        verifyOptions: { ignoreExpiration: false },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    BrandModule,
    UserModule,
    OrderModule,
    ClientModule,
    DesignModule,
    SubscriptionModule,
    AdminModule,
    MeasurementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule]
})
export class AppModule {}
