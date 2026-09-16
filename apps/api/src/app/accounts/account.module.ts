import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { SharedService } from '../shared/shared.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Brand, BrandSchema } from '../brands/schemas/brand.schema';
import { TokenModule } from '../tokens/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tailor.name, schema: TailorSchema },
      { name: User.name, schema: UserSchema },
      { name: Brand.name, schema: BrandSchema }
    ]),
    TokenModule
  ],
  controllers: [AccountController],
  providers: [AccountService, SharedService, JwtService],
})
export class AccountModule {}
