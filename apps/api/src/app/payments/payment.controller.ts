import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post('init')
  async initializeTransaction( 
    @Body() CreatePaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.processOrderPayment(CreatePaymentDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify/:id')
  async verifyPayment(@Param('id') paymentId: string) {
    return this.paymentService.verify(paymentId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('orders/:orderId')
  fetchOrderPayment(@Param('orderId') orderId: string) {
    return this.paymentService.findOrderPayment(orderId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
