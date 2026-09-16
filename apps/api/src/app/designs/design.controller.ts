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
import { DesignService } from './design.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('designs')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDesignDto: CreateDesignDto, @Req() req: any) {
    return this.designService.create(createDesignDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.designService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDesignDto: UpdateDesignDto) {
    return this.designService.update(+id, updateDesignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designService.remove(+id);
  }
}
