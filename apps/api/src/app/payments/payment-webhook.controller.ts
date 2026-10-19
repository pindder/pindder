import { BadRequestException, Controller, Headers, HttpCode, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import * as crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('payment-webhook')
export class PaymentWebhookController {
    private logger = new Logger(PaymentWebhookController.name);
    private secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');

    constructor(
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    @Post('paystack-webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(
        @Req() req: Request, @Res() res: Response,
        @Headers('x-paystack-signature') signature: string
    ) {
        // 1. Verify Paystack HMAC SHA512 Signature
        const hash = crypto
        .createHmac('sha512', this.secretKey || 'payment_secret')
        .update(JSON.stringify(req.body))
        .digest('hex');

        if (hash !== signature) {
            throw new BadRequestException('Invalid signature');
        }

        // 2. Acknowledge receipt immediately (Paystack expects a 200 OK fast)
        res.status(HttpStatus.OK).send({ status: 'success' });

        const event = req.body;
        this.logger.log(`Received Paystack Event: ${event.event}`);

        // 3. Handle specific event types
        switch (event.event) {
            case 'charge.success':
                await this.handleSuccessfulCharge(event.data);
                break;
            
            case 'subscription.create':
                await this.handleSubscriptionCreated(event.data);
                break;

            case 'invoice.create':
                await this.handleSuccessfulRenewal(event.data);
                break;

            case 'invoice.payment_failed':
                await this.handleFailedRenewal(event.data);
                break;

            default:
                this.logger.log(`Unhandled event type: ${event.event}`);
        }
    }

    private async handleSuccessfulCharge(data: any) {
        const metadata = data.metadata || {};
        
        // Check if this payment belongs to an Order or a Subscription package
        if (metadata.type === 'subscription' || data.plan) {
        // Dispatch an internal event for subscriptions
        this.eventEmitter.emit('subscription.payment.successful', {
            email: data.customer.email,
            amount: data.amount,
            reference: data.reference,
            planCode: data.plan?.plan_code || metadata.plan_code,
            subscriptionCode: data.subscription_code,
            metadata: metadata,
        });
        } else {
        // Dispatch an internal event for standard orders
        this.eventEmitter.emit('order.payment.successful', {
            reference: data.reference,
            amount: data.amount,
            metadata: metadata,
        });
        }
    }

    private async handleSubscriptionCreated(data: any) {
        // Optional: track when a recurring subscription is officially initialized
        this.logger.log(`Subscription created: ${data.subscription_code}`);
    }

    private async handleFailedRenewal(data: any) {
        // Renewal failed (e.g., expired card, insufficient funds)
        this.logger.log(`Subscription renewal failed: ${data.subscription_code}`);
    }

    private async handleSuccessfulRenewal(data: any) {
        // Sent 3 days before a renewal charge attempt is due
        this.logger.log(`Upcoming renewal invoice for customer: ${data.customer.email}`);
    }
}
