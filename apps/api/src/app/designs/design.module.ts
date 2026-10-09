import { Module } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignController } from './design.controller';
import { ClientModule } from '../clients/client.module';
import { BrandModule } from '../brands/brand.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Design, DesignSchema } from './schemas/design.schema';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notifications/notification.service';
import { NotificationModule } from '../notifications/notification.module';
import { Notification, NotificationSchema } from '../notifications/schema/notification.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Design.name, schema: DesignSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Tailor.name, schema: TailorSchema }
    ]),
    ClientModule, 
    BrandModule,
    NotificationModule
  ],
  controllers: [DesignController],
  providers: [DesignService, JwtService, NotificationService],
})
export class DesignModule {}
