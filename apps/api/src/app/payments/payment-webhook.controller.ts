import { BadRequestException, Controller, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { PaymentStatus } from '@pindder/contracts';

@Controller('payment-webhook')
export class PaymentWebhookController {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    ) {}

    @Post('paystack-webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(
        @Req() req: any,
        @Headers('x-paystack-signature') signature: string
    ) {
        // 1. Verify Paystack HMAC SHA512 Signature
        const secret = process.env.PAYSTACK_SECRET_KEY || 'payment_secret';
        const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

        if (hash !== signature) {
        throw new BadRequestException('Invalid signature');
        }

        const event = req.body;

        // 2. Process charge.success event idempotently
        if (event.event === 'charge.success') {
        const reference = event.data.reference;

        // Idempotency check: Find transaction by Paystack reference
        const tx = await this.paymentModel.findOne({ providerTransactionId: reference });

        if (tx && tx.status !== PaymentStatus.SUCCESS) {
            tx.status = PaymentStatus.SUCCESS;
            tx.responsePayload = event.data;
            await tx.save();

            // Trigger post-payment actions (e.g., mark order as PAID in Pindder DB)
            console.log(`Order for payment ref ${reference} marked as SUCCESS.`);
        }
        }

        // Always acknowledge Paystack webhook with 200 OK immediately
        return { status: 'acknowledged' };
    }
}
