import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(createOrderDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':id/quotes')
  postQuote(@Param('id') order_id: string, createQuoteDto: CreateQuoteDto) {
    return this.orderService.createQuote(order_id, createQuoteDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id/quotes')
  findOrderQuotes(@Param('id') order_id: string) {
    return this.orderService.findOrderQuotes(order_id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query('status') status: string, @Req() req: any) {
    return this.orderService.findAll(req.user.sub, status);
  }

  @UseGuards(AuthGuard)
  @Get('search')
  search(@Query('q') query: string) {
    return this.orderService.search(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
