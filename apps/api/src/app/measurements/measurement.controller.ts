import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMeasurementDto: CreateMeasurementDto, @Req() req: any) {
    return this.measurementService.create(createMeasurementDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.measurementService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measurementService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
  ) {
    return this.measurementService.update(+id, updateMeasurementDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.measurementService.remove(+id);
  }
}
