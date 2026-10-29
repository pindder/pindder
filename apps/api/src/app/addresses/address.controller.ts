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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    return this.addressService.create(createAddressDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
