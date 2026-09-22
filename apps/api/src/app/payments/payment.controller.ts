import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  async chargeUser(
    @Headers('x-idempotency-key') idempotencyKey: string,
    @Body() body: { client: string; tailor: string, amount: number; currency: string }
  ) {
    return this.paymentService.processPayment({
      idempotencyKey: idempotencyKey,
      tailor: body.tailor,
      client: body.client,
      amount: body.amount,
      currency: body.currency,
    });
  }

  // @Post('verify')
  // async verifyPayment(
  //   @Headers('x-idempotency-key') idempotencyKey: string,
  //   @Body('reference') reference: string
  // ) {
  //   return this.paymentService.verifyAndFinalizeTransaction(reference, idempotencyKey);
  // }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
