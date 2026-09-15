import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TailorService } from './tailor.service';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';

@Controller('tailor')
export class TailorController {
  constructor(private readonly tailorService: TailorService) {}

  @Post()
  create(@Body() createTailorDto: CreateTailorDto) {
    return this.tailorService.create(createTailorDto);
  }

  @Get()
  findAll() {
    return this.tailorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tailorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTailorDto: UpdateTailorDto) {
    return this.tailorService.update(+id, updateTailorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tailorService.remove(+id);
  }
}
