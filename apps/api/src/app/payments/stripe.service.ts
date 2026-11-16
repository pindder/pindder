import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Order } from '../orders/schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Client } from '../clients/schemas/client.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { CreatePlanDto } from '../plans/dto/create-plan.dto';
import { Plan } from '../plans/schema/plan.schema';
import { AccountTypes, DataTypes } from '@pindder/contracts';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private logger = new Logger(StripeService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
        @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Client.name) private readonly clientModel: Model<Client>,
        private configService: ConfigService,
    ) {
        const secretKey = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

        if(!secretKey) {
            this.logger.warn('Missing stripe seceret key!');
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: '2026-10-28.endive', // Match your Stripe API version
        });
    }

    async createPaymentIntent(amount: number, currency = 'ngn') {
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

    async createCheckoutSession(transaction_type: string, id: string, user: any) {
        try {
            const line_items: any[] = [];
            let item: any;
            let stripe_customer_id = '';
            let client_ref_id: string;

            if(transaction_type === DataTypes.SUBSCRIPTION) {
                const [plan, tailor] = await Promise.all([
                    this.planModel.findById(id),
                    this.tailorModel.findById(user.sub)
                ]);

                if(!plan || !tailor) {
                    return new NotFoundException();
                }

                if (!tailor.stripeCustomerId) {
                    const { customer, error } = await this.createStripeCustomer(tailor);

                    if (customer) {
                        tailor.stripeCustomerId = customer.id; // Assign ONLY the string ID (e.g., cus_...)
                        await tailor.save();
                    } else {
                        this.logger.error('Could not save stripeCustomerId', error);
                        throw new InternalServerErrorException(error);
                    }                
                }

                const line_item = {
                    price: plan.metadata.price.id,
                    quantity: 1,
                }

                client_ref_id = plan._id.toString();
                item = plan;
                stripe_customer_id = tailor.stripeCustomerId;
                line_items.push(line_item);
            } else if(transaction_type === DataTypes.ORDER) {
                const order = await this.orderModel.findById(id);
                let client: User | Client | null;

                if(!order) {
                    return new NotFoundException()
                }

                client_ref_id = order.orderId;

                if(user.accountType === AccountTypes.USER) {
                    client = await this.userModel.findById(user.sub);
                } else {
                    client = await this.clientModel.findById(order.client);
                }

                if(!client) {
                    return new NotFoundException();
                }
                
                if (client instanceof User && !client.stripeCustomerId) {
                    const { customer, error } = await this.createStripeCustomer(client);

                    if (customer) {
                        client.stripeCustomerId = customer.id; // Assign ONLY the string ID (e.g., cus_...)
                        await client.save();

                        stripe_customer_id = client.stripeCustomerId;
                    } else {
                        this.logger.error('Could not save stripeCustomerId', error);
                        throw new InternalServerErrorException(error);
                    }                
                }

                item = order;
                
                item.styles.forEach((style: any) => {
                    const lineItem = {
                        price_data: {
                            currency: 'ngn',
                            product_data: {
                                name: style.name,
                            },
                            unit_amount: style.amount,
                        },
                        quantity: style.quantity
                    }
                    line_items.push(lineItem);
                }); 
            } else return;

            const session = await this.stripe.checkout.sessions.create({
                client_reference_id: client_ref_id,
                allowed_payment_method_types: ['card', 'amazon_pay', 'revolut_pay'],
                line_items: line_items,
                mode: item instanceof Order ? 'payment' : 'subscription',
                success_url: 'http://localhost:4800/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:4800/cancel',
                customer: stripe_customer_id
            });

            this.logger.log('STRIPE_CHECKOUT_SESSION:', session);

            return { url: session.url };
        } catch(error: any) {
            this.logger.error('STRIPE_CHECKOUT_SESSION:', error);
            throw new InternalServerErrorException(error);
        }
    }

    async createSubscriptionProduct(createPlanDto: CreatePlanDto, recommended?: boolean) {
        try {
          // 1. Create the Product
          const product = await this.stripe.products.create({
            name: createPlanDto.name,
            description: createPlanDto.description,
          });
    
          // 2. Create a recurring Price attached to that Product
          const price = await this.stripe.prices.create({
            product: product.id,
            unit_amount: createPlanDto.amount * 100,
            currency: 'ngn',
            recurring: {
              interval: createPlanDto.interval, // Options: 'day', 'week', 'month', 'year'
              interval_count: 1, // e.g., every 1 month
            },
          });
    
          this.logger.log('NEW_STRIPE_PRODUCT::', product)
          this.logger.log('NEW_STRIPE_PRICE::', price);
          this.logger.log(`Created Product: ${product.id} and Price: ${price.id}`);
    
          const newPlan = await this.planModel.create({
            ...createPlanDto,
            metadata: {
              product: { ...product },
              price: { ...price }
            },
            amount: createPlanDto.amount,
            recommended: recommended ?? false
          });
    
          this.logger.log('NEW_PALN::', newPlan);
          return newPlan;
        } catch (error) {
          console.error('Failed to create Stripe product/price:', error);
          throw error;
        }
    }

    async createSubscription(product_id: string, user: any): Promise<any> {
        try {
            const [plan, tailor] = await Promise.all([
                this.planModel.findById(product_id),
                this.tailorModel.findById(user.sub)
            ]);

            if(!plan || !tailor) {
                return new NotFoundException();
            }

            if (!tailor.stripeCustomerId) {
                const { customer, error } = await this.createStripeCustomer(tailor);

                if (customer) {
                    tailor.stripeCustomerId = customer.id; // Assign ONLY the string ID (e.g., cus_...)
                    await tailor.save();
                } else {
                    this.logger.error('Could not save stripeCustomerId', error);
                    throw new InternalServerErrorException(error);
                }                
            }

            const subscription = await this.stripe.subscriptions.create({
                collection_method: 'charge_automatically',
                payment_behavior: 'allow_incomplete',
                currency: 'ngn',
                customer: tailor.stripeCustomerId,
                description: `You inititated a subscription to pindder's ${plan.name} package`,
                items: [
                    {
                        price: plan.metadata.price.id,
                        quantity: 1,

                    }
                ]
            });

            this.logger.log("NEW_SUBSCRIPTION::", subscription);
            return subscription;
        } catch(error: any) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        } 
    }

    async createStripeCustomer(user: Tailor | User): Promise<{ customer?: Stripe.Customer; error?: any }> {
        try {
            const customer = await this.stripe.customers.create({
                email: user.email,
                name: user.fullname, // Use 'name' or 'individual_name' depending on API version
                phone: `${user.countryCode}${user.tel}`,
                description: user.accountType,
                metadata: {
                    userId: user._id.toString(), // Keep metadata flat and string-based
                    role: user.accountType
                },
                payment_method: 'card'
            });

            this.logger.log(`NEW_STRIPE_CUSTOMER:: ${customer.id}`);
            return { customer };
        } catch (error: any) {
            this.logger.error('Failed to create Stripe customer:', error);
            return { error };
        }
    }
}
