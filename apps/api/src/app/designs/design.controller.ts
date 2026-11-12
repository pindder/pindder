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
  Query,
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
    return this.designService.create(createDesignDto, req.user);
  }

  @Post()
  user(@Body() createDesignDto: CreateDesignDto, @Req() req: any) {
    return this.designService.create(createDesignDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: any
  ) {
    return await this.designService.findAll(req.user, page, limit);
  }

  @Get('catalogs/:id')
  listCatalog(@Param('id') id: string) {
    return this.designService.findCatalogs(id);
  }

  @UseGuards(AuthGuard)
  @Get('search')
  search(@Query('q') query: string, @Req() req: any) {
    return this.designService.search(query, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateDesignDto: UpdateDesignDto
  ) {
    return this.designService.update(id, updateDesignDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/delete-img')
  deleteDesignImage(@Param('id') id: string, @Body() body: any) {
    return this.designService.removeDesignImage(id, body.imgUrl);
  }
}
