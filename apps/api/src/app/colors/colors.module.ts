import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { Color, ColorSchema } from './schema/color.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }])
  ],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
