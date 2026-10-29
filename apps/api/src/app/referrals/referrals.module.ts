import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Referral, ReferralSchema } from './schema/referral.schema';
import { Tailor, TailorSchema } from '../tailors/schemas/tailor.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referral.name, schema: ReferralSchema },
      { name: Tailor.name, schema: TailorSchema }
    ])
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService, JwtService],
  exports: [MongooseModule, ReferralsService]
})
export class ReferralsModule {}
