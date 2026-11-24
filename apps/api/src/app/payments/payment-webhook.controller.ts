import { BadRequestException, Body, Controller, Headers, HttpCode, HttpStatus, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { timingSafeEqual } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction';
import { Model } from 'mongoose';

@Controller('payment-webhook')
export class PaymentWebhookController {
    private stripe: Stripe;
    private logger = new Logger(PaymentWebhookController.name);
    private secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    private stripe_secretKey = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

    constructor(
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2,
        private readonly stripeService: StripeService,
        private readonly http: HttpService,
        @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>
    ) {
        const secretKey = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');
        
        if(!secretKey) {
            this.logger.warn('Missing stripe seceret key!');
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: '2026-10-28.endive', // Match your Stripe API version
        });
    }

    @Post('paystack')
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

    @Post('stripe')
    async handleStripeWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        let event: Stripe.Event;

        try {
            // req.body is injected automatically because rawBody: true was set in main.ts
            if (!req.body) {
                return res.status(HttpStatus.BAD_REQUEST).send('Webhook Error: Missing raw body');
            }

            event = this.stripe.webhooks.constructEvent(
                req.body,
                signature,
                this.stripe_secretKey,
            );
        } catch (err: any) {
            this.logger.error(`⚠️ Webhook signature verification failed: ${err.message}`);
            return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
        }

        // Handle specific event types safely
        switch (event.type) {
            // ---------------------------------------------------------
            // ONE-TIME PAYMENTS & CHECKOUT
            // ---------------------------------------------------------
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`💰 PaymentIntent for ${paymentIntent.amount} succeeded! ID: ${paymentIntent.id}`);
                // TODO: Update your MongoDB order status here
                break;
            }

            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                this.logger.log(`🛍️ Checkout Session completed! ID: ${session.id}`);
                // TODO: Fulfill digital goods or save customer reference
                break;
            }

            // ---------------------------------------------------------
            // SUBSCRIPTION LIFECYCLE EVENTS
            // ---------------------------------------------------------
            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;
                this.logger.log(`📦 Subscription created: ${subscription.id} for customer ${subscription.customer}`);
                // TODO: Save subscription record & status ('active' or 'trialing') in MongoDB
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                this.logger.log(`🔄 Subscription updated: ${subscription.id}. Status: ${subscription.status}`);
                // TODO: Update subscription status, plan tier, or current period end in MongoDB
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                this.logger.log(`❌ Subscription canceled/ended: ${subscription.id}`);
                // TODO: Revoke user access / downgrade account in MongoDB
                break;
            }

            // ---------------------------------------------------------
            // RECURRING INVOICE & PAYMENT EVENTS
            // ---------------------------------------------------------
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                // If this invoice is for a subscription renewal
                if ('subscription' in invoice && invoice.subscription) {
                    console.log(`💰 Subscription renewal payment succeeded for invoice: ${invoice.id}`);
                    // TODO: Extend user access period in MongoDB
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                if ('subscription' in invoice && invoice.subscription) {
                console.log(`⚠️ Subscription payment failed for invoice: ${invoice.id}`);
                // TODO: Notify user via email (using Resend) or flag account as 'past_due'
                }
                break;
            }

            // ---------------------------------------------------------
            // STRIPE CONNECT ACCOUNT ONBOARDING EVENTS
            // ---------------------------------------------------------
            case 'account.updated': {
                const account = event.data.object as Stripe.Account;
                
                console.log(`👤 Connect Account updated: ${account.id}`);
                console.log(`- Payouts Enabled: ${account.payouts_enabled}`);
                console.log(`- Charges Enabled: ${account.charges_enabled}`);

                // Check if the user has successfully finished onboarding
                if (account.payouts_enabled && account.charges_enabled) {
                // TODO: Update user status in MongoDB to 'onboarding_complete'
                console.log(`✅ Account ${account.id} is fully verified and ready for payouts!`);
                } else {
                // TODO: Account still has pending requirements (e.g., missing ID or bank info)
                const pendingRequirements = account.requirements?.currently_due || [];
                console.log(`⚠️ Account ${account.id} still needs:`, pendingRequirements);
                }
                break;
            }

            case 'capability.updated': {
                const capability = event.data.object as Stripe.Capability;
                const stripeAccountId = event.account; // ID of the connected account
                
                console.log(`🔄 Capability ${capability.id} status changed to ${capability.status} for account ${stripeAccountId}`);
                // TODO: Update capability status in your database if needed
                break;
            }

            case 'account.application.deauthorized': {
                const connectedAccountId = event.account;
                console.log(`❌ User deauthorized connected account: ${connectedAccountId}`);
                // TODO: Unlink stripeAccountId from user model in MongoDB
                break;
            }
            
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Acknowledge receipt of the event back to Stripe
        return res.status(HttpStatus.OK).json({ received: true });
    }

    isValidSecretHash(received?: string, expected?: string): boolean {
        if (!received || !expected) return false;
        const a = Buffer.from(received);
        const b = Buffer.from(expected);
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    }

    @Post('flw')
    @HttpCode(200)
    async handleFlwWebhook(
        @Req() req: Request,
        @Headers('verif-hash') verifHash?: string,
    ) {
        const secretHash = this.configService.get<string>('FLW_WBHK_SECHASH');
        if (!this.isValidSecretHash(verifHash, secretHash)) {
            this.logger.warn('Rejected Flutterwave webhook: invalid verif-hash');
            throw new UnauthorizedException('Invalid webhook signature');
        }

        const event = req.body?.event;
        const data = req.body?.data;
        const txId = data?.id;
        const txRef = data?.tx_ref;

        this.logger.log(
            `Flutterwave webhook received: event=${event ?? 'unknown'} tx_ref=${txRef ?? 'none'} id=${txId ?? 'none'}`,
        );

        if (event !== 'charge.completed' || !txId || !txRef) {
            return { received: true };
        }

        // 1. Look up your local transaction first and skip if already settled (idempotency)
        const localTxn = await this.transactionModel.findOne({ txRef });
        if (!localTxn) {
          this.logger.warn(`No local transaction found for tx_ref=${txRef}`);
          return { received: true };
        }
        if (localTxn.status === 'successful') {
          return { received: true };
        }

        // 2. Re-query Flutterwave to verify status, amount, currency, and tx_ref
        const secretKey = this.configService.get<string>('FLW_SK');
        const baseUrl = this.configService.get<string>('FLW_URL', 'https://api.flutterwave.com/v3');

        const verifyResponse = await firstValueFrom(
        this.http
            .get(`${baseUrl}/transactions/${txId}/verify`, {
            timeout: 15000,
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            })
            .pipe(
            catchError((err: AxiosError) => {
                this.logger.error(
                `Flutterwave verify failed for tx_ref=${txRef} (${err.response?.status ?? 'network'}): ${JSON.stringify(err.response?.data)}`,
                );
                return throwError(() => err);
            }),
            ),
        );

        const verified = verifyResponse.data?.data;
        const isVerifiedSuccess =
        verifyResponse.data?.status === 'successful' &&
        verified?.status === 'successful' &&
        verified?.tx_ref === txRef;

        if (!isVerifiedSuccess) {
            this.logger.warn(
                `Flutterwave charge not successful for tx_ref=${txRef}: status=${verified?.status ?? 'unknown'}`,
            );

            // Optionally mark local transaction as FAILED if verified?.status === 'failed'
            if (verified?.status === 'failed') {
                // Only mark failed if not already settled as SUCCESS
                await this.transactionModel.updateOne(
                    { txRef, status: { $nin: ['successful', 'failed'] } },
                    {
                        $set: {
                            status: 'failed',
                        },
                    },
                );
            }
            return { received: true };
        }

        // 3. Validate amount & currency against your local transaction before fulfilling
        // if (
        //   verified.currency !== localTxn.currency ||
        //   Number(verified.amount) < Number(localTxn.amount)
        // ) {
        //   this.logger.error(`Amount/currency mismatch for tx_ref=${txRef}`);
        //   return { received: true };
        // }

        // 4. Atomically update your transaction record so duplicate deliveries are harmless
        await this.transactionModel.updateOne(
          { txRef, status: { $ne: 'successful' } },
          {
            $set: {
              status: 'successful',
              flwRef: verified.flw_ref,
            },
          },
        );

        this.logger.log(`Flutterwave payment verified for tx_ref=${txRef}`);
        return { received: true };
    }

    @Post('stripe/webhook/register')
    async registerWebhook(@Body() body: any) {
        return await this.stripeService.registerWebhookEndpoint(body);
    }
}
