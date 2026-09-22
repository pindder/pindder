import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaystackService {
    private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    private readonly baseUrl = 'https://api.paystack.co';

    // 1. Initialize a Transaction (for Checkout Modal / Redirect)
    async initializeTransaction(
        email: string,
        amountInKobo: number,
        idempotencyKey: string,
        metadata?: Record<string, any>
    ) {
        try {
        const response = await axios.post(
            `${this.baseUrl}/transaction/initialize`,
            {
            email,
            amount: amountInKobo, // Paystack expects amounts in Kobo (e.g. ₦1000 = 100000)
            metadata: {
                ...metadata,
                idempotency_key: idempotencyKey, // Include key in metadata for webhook lookup
            },
            },
            {
            headers: {
                Authorization: `Bearer ${this.paystackSecretKey}`,
                'Content-Type': 'application/json',
                // Pass Idempotency Key header directly to Paystack
                'X-Idempotency-Key': idempotencyKey,
            },
            }
        );

        return response.data;
        } catch (error: any) {
        throw new InternalServerErrorException(
            error.response?.data?.message || 'Paystack initialization failed'
        );
        }
    }

    // 2. Charge Recurring Card Authorization (Direct Charge)
    async chargeAuthorization(
        email: string,
        amountInKobo: number,
        authorizationCode: string,
        idempotencyKey: string
    ) {
        try {
        const response = await axios.post(
            `${this.baseUrl}/transaction/charge_authorization`,
            {
            email,
            amount: amountInKobo,
            authorization_code: authorizationCode,
            },
            {
            headers: {
                Authorization: `Bearer ${this.paystackSecretKey}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey,
            },
            }
        );

        return response.data;
        } catch (error: any) {
        throw new InternalServerErrorException(
            error.response?.data?.message || 'Paystack direct charge failed'
        );
        }
    }
}
