import { Module } from '@nestjs/common';
import { TailorService } from './tailor.service';
import { TailorController } from './tailor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tailor, TailorSchema } from './schemas/tailor.schema';
import { TokenModule } from '../tokens/token.module';
import { SharedModule } from '../shared/shared.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tailor.name, schema: TailorSchema }
    ]), 
    TokenModule,
    SharedModule
  ],
  controllers: [TailorController],
  providers: [TailorService, JwtService],
  exports: [MongooseModule, TailorService, JwtService]
})
export class TailorModule {}
