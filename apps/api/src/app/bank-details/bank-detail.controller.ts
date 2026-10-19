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
import { BankDetailService } from './bank-detail.service';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('banks')
export class BankDetailController {
  constructor(private readonly bankDetailService: BankDetailService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBankDetailDto: CreateBankDetailDto, @Req() req: any) {
    return this.bankDetailService.create(createBankDetailDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.bankDetailService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('search')
  searchBanks(@Req() req: any) {
    return this.bankDetailService.search(req.user.sub)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankDetailService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBankDetailDto: UpdateBankDetailDto,
  ) {
    return this.bankDetailService.update(id, updateBankDetailDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankDetailService.remove(id);
  }
}
