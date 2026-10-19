import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schema/plan.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema }
    ])
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [MongooseModule, PlanService]
})
export class PlanModule {}
