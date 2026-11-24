import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RawAxiosHeaders } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import forge from 'node-forge';
import { AccountTypes } from '@pindder/contracts';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Client } from '../clients/schemas/client.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { Order } from '../orders/schemas/order.schema';
import { Model } from 'mongoose';
import { Bank } from './schemas/bank';
import { RedisService } from '../shared/redis.service';
import { BankDetail } from '../bank-details/schema/bank-detail.schema';
import { AxiosError } from 'axios';
import { EventEmitter } from 'stream';
import { OnEvent } from '@nestjs/event-emitter';
import { Transaction } from './schemas/transaction';
// import axios from 'axios';

@Injectable()
export class FlutterwaveService {
    private logger = new Logger(FlutterwaveService.name);
    private clientSecret: string;
    private flw_url: string;

    private header: RawAxiosHeaders;

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Client.name) private readonly clientModel: Model<Client>,
        @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
        @InjectModel(BankDetail.name) private readonly banksModel: Model<BankDetail>,
        @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
        private readonly http: HttpService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly eventEmitter: EventEmitter 
    ) {
        this.clientSecret = this.configService.getOrThrow<string>('FLW_SK');
        this.flw_url = this.configService.getOrThrow<string>('FLW_URL');

        this.header = {
            Authorization: `Bearer ${this.clientSecret}`,
            "Content-Type": "application/json"
        }

        if(!this.clientSecret || !this.flw_url) {
            this.logger.warn('');
        }
    }

    async encrypt(encryptionKey: string, payload: unknown) {
        const text = JSON.stringify(payload);
        // const forge = require("node-forge");
        const cipher = forge.cipher.createCipher(
            "3DES-ECB",
            forge.util.createBuffer(encryptionKey)
        );
        cipher.start({iv: ""});
        cipher.update(forge.util.createBuffer(text, 'utf8'));
        cipher.finish();
        const encrypted = cipher.output;
        return forge.util.encode64(encrypted.getBytes());
    }

    async checkout(order_id: string, user: any) {
        try {
            let client: User | Client | null;
            let totalAmount = 0;

            const order = await this.orderModel.findById(order_id);

            if(!order) {
                return new NotFoundException()
            }

            // check if vendor has bank account associated
            const bank = await this.banksModel.findOne({ tailor: order.tailor });

            if(!bank) {
                throw new HttpException('You are yet to provide your payout details.', HttpStatus.FAILED_DEPENDENCY);
            }

            if(user.accountType === AccountTypes.USER) {
                client = await this.userModel.findById(user.sub);
            } else {
                client = await this.clientModel.findById(order.client);
            }

            if(!client) {
                return new NotFoundException();
            }
            
            order.styles.forEach((style: any) => {
                totalAmount += style.amount;
            }); 

            const transaction = await this.transactionModel.findOne({ tx_ref: order.orderId });

            if(transaction) {
                return transaction.checkoutUrl;
            }

            const response = await firstValueFrom(
                this.http.post(
                    `${this.flw_url}/payments`, 
                    JSON.stringify(
                        {
                            "amount": totalAmount,
                            "tx_ref": order.orderId,
                            "currency": "NGN",
                            "redirect_url": `https:/pindder-web.onrender.com/app/order/${order._id}`,
                            "customer": {
                                "email": client.email,
                                "phone_number": client instanceof Client ? client.phoneNo : client.countryCode + client.tel,
                                "name": client.fullname
                            },
                            "customizations": {
                                "title": "Pindder Payment",
                                "logo": "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
                            },
                            "payment_options": "card, ussd, mobilemoneyghana",
                            // "configuration": {
                            //     "session_duration": 30,
                            //     "max_retry_attempt": 5
                            // },
                            // "link_expiration": "2024-02-14T12:20:00",
                            "subaccounts": [
                                {
                                    "id": bank.meta.subaccount_id
                                }
                            ],
                            // "meta": {
                                
                            // }
                    }),
                    { timeout: 20000, headers: this.header}
                )
            );

            const data = await response.data;
            
            this.logger.log('HOSTED_CHECKOUT_LINK_FLW::', data.link);

            this.eventEmitter.emit('create-transaction', {
                totalAmount: totalAmount,
                checkoutUrl: data.link,
                order: order,
            });

            return data;
        } catch(error:any) {
            this.logger.error('Flutterwave payment initialization failed', {
                code: error?.code,
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data,
                txRef: order_id,
            });
            throw error;
        }
    }

    async fetchBanks() {
        try {
            const cached = await this.redisService.getCachedResponse('banks');
            
            if(cached !== null) {
                this.logger.log('CACHE_HIT_BANKS_LIST');
                return cached;
            }
            
            this.logger.log('CACHE_MISS_BANKS_LIST');

            const banks = await this.bankModel.find().sort({
                name: 'desc'
            });

            if(banks.length > 0) {
                await this.redisService.setCachedResponse('banks', banks);
                return banks;
            }

            const response = await firstValueFrom(this.http.get(
                `${this.flw_url}/banks/NG`,
                { timeout: 20000, headers: this.header}
            ));

            // this.logger.log('FLW_BANKS_LIST_CACHED:::', response.data);
            const saved = await this.bankModel.insertMany(response.data.data);
            await this.redisService.setCachedResponse('banks', saved);

            return saved;
        } catch(error: any) {
            this.logger.error(error);
            return error;
        }
    }

    async fetchBalance() {
        try {
            const response = await firstValueFrom(this.http.get(`${this.flw_url}/`, this.header));

            this.logger.log(response);
        } catch(error: any) {
            this.logger.error(error);
            return error;
        }
    }

    async createSubAccount(tailor: Tailor, accountDetail: BankDetail, bank: Bank) {
        const payload = {
            account_bank: String(bank.code),
            account_number: String(accountDetail.accountNo),
            business_name: accountDetail.accountName,
            country: 'NG',
            split_value: '0.5',
            business_mobile: `0${tailor.tel}`,
            business_email: tailor.email,
            business_contact: tailor.fullname,
            split_type: 'percentage',
        };

        const response = await firstValueFrom(
            this.http
                .post(`${this.flw_url}/subaccounts`, payload, {
                    timeout: 20000,
                    headers: this.header,
                })
                .pipe(
                    catchError((err: AxiosError) => {
                        const flwBody = err.response?.data;
                        this.logger.error(
                        `Flutterwave subaccount error (${err.response?.status ?? 'unknown'}): ${JSON.stringify(flwBody)}`,
                        );
                        return throwError(
                        () =>
                            new BadRequestException(
                            flwBody ?? 'Flutterwave subaccount creation failed',
                            ),
                        );
                    }),
                ),
            );

            this.logger.log(
            `Flutterwave subaccount created: ${JSON.stringify(response.data.data)}`,
            );
            return response.data;
    }

    async fetchTransactions() {
        return;
    }

    async createVirtualAccount(user: Tailor | User) {
        return;
    }

    @OnEvent('create-transaction')
    async handleCreateTransaction(payload: {
        totalAmount: number,
        checkoutUrl: string,
        order: Order,
    }) {
        try {
            const new_transaction = await this.transactionModel.create({
                txRef: payload.order.orderId,
                client: payload.order.client,
                tailor: payload.order.tailor,
                currency: 'NGN',
                amount:  payload.totalAmount.toString(),
                checkoutUrl: payload.checkoutUrl,
            });

            this.logger.log('Transaction initiated:', new_transaction);
        } catch(error: any) {
            this.logger.error(error);
            return;
        }
    }
}
