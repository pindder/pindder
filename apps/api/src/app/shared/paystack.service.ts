import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { Payment } from '../payments/schemas/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaystackService {
    private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    private readonly baseUrl = 'https://api.paystack.co';
    private readonly logger = new Logger(PaystackService.name);
    private headers = {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
    };

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>
    ) {}

    // 1. Initialize a Transaction (for Checkout Modal / Redirect)
    async initializeTransaction(
        amountInKobo: number,
        idempotencyKey: string,
        metadata: Record<string, any>,
        plan = ''
    ) {
        try {
            const data:any = {
                email: metadata.email,
                amount: amountInKobo, // Paystack expects amounts in Kobo (e.g. ₦1000 = 100000)
                metadata: {
                    ...metadata,
                    idempotency_key: idempotencyKey, // Include key in metadata for webhook lookup
                },
            }

            // Safely handle plan
            if (plan) {
                data.plan = plan;
            }

            const response = await firstValueFrom(
                this.httpService.post(
                `${this.configService.get<string>('PAYSTACK_BASE_URL')}/transaction/initialize`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`,
                        'Content-Type': 'application/json',
                        // Pass Idempotency Key header directly to Paystack
                        'X-Idempotency-Key': idempotencyKey,
                    },
                }
            ));

            return response.data.data;
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

    // 3. Verify Transaction
    async verifyTransaction(transactionId: string) {
        try {
            const transactionDoc = await this.paymentModel.findById(transactionId);
            
            if(!transactionDoc) {
                return false;
            }

            const transaction = transactionDoc.toObject();
            console.log(transaction);

            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.configService.get<string>('PAYSTACK_BASE_URL')}/transaction/verify/${transaction.providerTransactionId}`,
                    { headers: { ...this.headers, 'X-Idempotency-Key': transaction.idempotencyKey }}
                )
            );

            this.logger.log(`${response.data.data}`);
            return response.data.data;
        } catch(error: any) {
            throw new InternalServerErrorException(
                error.response?.data?.message || 'Paystack initialization failed'
            );
        }
    }

    // 4. Create Customer 
    async createCustomer(data: any) {
        try {
            const userData = {
                first_name: data.firstname,
                last_name: data.lastname,
                email: data.email,
                phone: data.phoneNo,
                metadata: data
            };

            const response = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/customer`, userData, { headers: this.headers })
            )

            this.logger.log(`New customer created in paystack`, response.data.data);
            return;
        } catch(error: any) {
            this.logger.log(error);
            return error;
        }
    }
}
