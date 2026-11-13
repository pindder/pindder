import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
    private stripe: Stripe;
    private logger = new Logger(StripeService.name);

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

        if(!secretKey) {
            this.logger.warn('Missing stripe seceret key!');
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: '2026-10-28.endive', // Match your Stripe API version
        });
    }

    async createPaymentSheetIntent(amount: number, currency = 'ngn') {
        try {
            // 1. Create a transient customer (or fetch an existing one from your database)
            const customer = await this.stripe.customers.create();

            // 2. Create an Ephemeral Key for the customer (Required by mobile PaymentSheet)
            const ephemeralKey = await this.stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: '2026-10-28.endive' }
            );

            const amountInKobo = amount * 100;

            // 3. Create the PaymentIntent with the specified amount and currency
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountInKobo, // Amount in cents (e.g., $10.00 = 1000)
                currency,
                customer: customer.id,
                automatic_payment_methods: {
                enabled: true, // Enables Cards, Apple Pay, Google Pay automatically
                },
            });

            // 4. Return all required secrets back to your Ionic frontend
            return {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: this.configService.get<string>('STRIPE_PUBLISHABLE_KEY'),
            };
        } catch (error: any) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message);
        }
    }
}
