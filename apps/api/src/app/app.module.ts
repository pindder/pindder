import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brands/brand.module';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderModule } from './orders/order.module';
import { ClientModule } from './clients/client.module';
import { DesignModule } from './designs/design.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { AdminModule } from './admins/admin.module';
import { MeasurementModule } from './measurements/measurement.module';
import { TailorModule } from './tailors/tailor.module';
import { SharedService } from './shared/shared.service';
import { SharedModule } from './shared/shared.module';
import { TokenModule } from './tokens/token.module';
import { AccountModule } from './accounts/account.module';

@Module({
  imports: [
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
    TailorModule,
    SharedModule,
    TokenModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService, SharedService],
})
export class AppModule {}
