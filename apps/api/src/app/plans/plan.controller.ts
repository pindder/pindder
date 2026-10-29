import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Query('type') type: string, @Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto, type);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.planService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
