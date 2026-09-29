import { Module } from '@nestjs/common';
import { TailorService } from './tailor.service';
import { TailorController } from './tailor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tailor, TailorSchema } from './schemas/tailor.schema';
import { SharedService } from '../shared/shared.service';
import { TokenModule } from '../tokens/token.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Tailor.name, schema: TailorSchema }
  ]), TokenModule],
  controllers: [TailorController],
  providers: [TailorService, SharedService],
  exports: [MongooseModule]
})
export class TailorModule {}
