import { Module } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignController } from './design.controller';
import { ClientModule } from '../clients/client.module';
import { BrandModule } from '../brands/brand.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Design, DesignSchema } from './schemas/design.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Design.name, schema: DesignSchema }
    ]),
    ClientModule, 
    BrandModule
  ],
  controllers: [DesignController],
  providers: [DesignService, JwtService],
})
export class DesignModule {}
