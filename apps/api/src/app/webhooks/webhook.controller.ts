import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  async paystackHook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature?: string,
  ) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new UnauthorizedException('Paystack webhook is not configured');
    }
    if (!signature || !req.rawBody) {
      throw new BadRequestException('Missing signature or raw request body');
    }

    const expected = crypto
      .createHmac('sha512', secret)
      .update(req.rawBody)
      .digest();
    let supplied: Buffer;
    try {
      supplied = Buffer.from(signature, 'hex');
    } catch {
      throw new BadRequestException('Invalid signature');
    }
    if (
      supplied.length !== expected.length ||
      !crypto.timingSafeEqual(expected, supplied)
    ) {
      throw new BadRequestException('Invalid signature');
    }

    await this.webhookService.handlePaystackEvent(req.body);
    return { status: 'acknowledged' };
  }
}
