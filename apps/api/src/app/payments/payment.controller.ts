import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { StripeService } from './stripe.service';
import { FlutterwaveService } from './flutterwave.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
    private readonly flwService: FlutterwaveService
  ) {}

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

  /** FLUTTERWAVE PAYMENTS CONTROLLERS */
  @UseGuards(AuthGuard)
  @Get('flw/banks')
  async fetchBanks() {
    return this.flwService.fetchBanks();
  }

  @UseGuards(AuthGuard)
  @Post('flw/checkout')
  async getCheckoutUrlFlw(
    @Query('order_id') order_id: string,
    @Req() req: any
  ) {
    return this.flwService.checkout(order_id, req.user);
  }

  /** STRIPE PAYMENTS CONTROLLERS */
  @UseGuards(AuthGuard)
  @Get('stripe/account')
  async getAccount(@Req() req: any) {
    return this.stripeService.retrieveStripeAccount(req.user);
  }

  @Post('stripe/intent')
  async getPaymentIntent(
    @Query('order_id') order_id: string,
    @Body() body: { amount: number; currency: string }
  ) {
    return this.stripeService.createPaymentIntent(body.amount, body.currency);
  }

  @UseGuards(AuthGuard)
  @Post('stripe/checkout')
  async getCheckoutUrl(
    @Query('item_id') item_id: string,
    @Query('transaction_type') transaction_type: string,
    @Req() req: any
  ) {
    return this.stripeService.createCheckoutSession(transaction_type, item_id, req.user);
  }

  @UseGuards(AuthGuard)
  @Post('stripe/subscribe')
  async createSubscription(
    @Query('product_id') product_id: string,
    @Req() req: any
  ) {
    return this.stripeService.createSubscription(product_id, req.user);
  }
}
