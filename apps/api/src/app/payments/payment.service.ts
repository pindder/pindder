import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { RedisService } from '../shared/redis.service';
import { IResponse, PaymentStatus, PaymentTypes } from '@pindder/contracts';
import { PaystackService } from '../shared/paystack.service';
import { Order } from '../orders/schemas/order.schema';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
  private logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private redisService: RedisService,
    private paystackService: PaystackService
  ) {}

  @OnEvent('order.payment.successful')
  async handleOrderPaymentFulfilled(payload: {
    email: string;
    amount: number;
    reference: string;
    metadata: any;
  }) {
    this.logger.log(`Processing successful order payment for ${payload}`);
    
    const payment = await this.paymentModel.findOne({ providerTransactionId: payload.reference });

    if(!payment) {
      this.logger.error(`Payment not found:`, payload.metadata);
      return; 
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.metadata = payload.metadata;

    await payment.save()
    return;
  }

  async processOrderPayment(createPaymentDto: CreatePaymentDto) {
    let idempotencyKey: string | undefined;

    try {
      // 1. Check if Order exists
      const orderDoc = await this.orderModel.findById(createPaymentDto.orderId);

      // 2. If order is not found return 
      if(!orderDoc) {
        throw new NotFoundException('Order not found.');
      }

      // 3. Convert document to object
      const order = orderDoc?.toObject();
      
      // 4. Extract tailor details from order object into a variable
      //const tailor = order.tailor;

      // 5. Extract client information from order and assign to variable declared above
      const client = order.client || order?.user;
      
      // 6. Check that client information exists
      if (!client) {
        throw new BadRequestException('Client information is missing from the order.');
      }

      // 7. Extract idempotencyKey safely
      if (!order.orderId || !order.orderId.includes('-')) {
        throw new BadRequestException('Invalid order reference format for idempotency.');
      }

      // 8. Assign IdempotencyKey safely;
      idempotencyKey = order.orderId.split('-')[1];

      // 9. If Idempotency key is empty return
      if (!idempotencyKey) {
        throw new BadRequestException('x-idempotency-key header is required');
      }

      // 10. Check Redis Cache
      // const cachedResponse = await this.redisService.getCachedResponse(idempotencyKey);
      // console.log('cachedResponse::::::', cachedResponse);
      // if (cachedResponse) {
      //   return cachedResponse;
      // }

      // 11. Check Database for Existing Transaction
      const existingTx = await this.paymentModel.findOne({ idempotencyKey });
      if (existingTx && existingTx.status === PaymentStatus.PROCESSING) {
        const response: IResponse<any> = {
          statusCode: 201,
          msg: `Transaction ${existingTx.providerTransactionId} already exists`,
          data: existingTx.responsePayload,
        };
        await this.redisService.setCachedResponse(idempotencyKey, response);
        return response;
      }

      // 12. Acquire Distributed Lock (30s TTL)
      // const lockAcquired = await this.redisService.acquireLock(idempotencyKey, 30);
      // console.log('lockAcquired::::::', lockAcquired);
      // if (!lockAcquired) {
      //   throw new ConflictException('Payment request is already processing. Please wait.');
      // }

      // 13. Convert Naira to Kobo for Paystack
      const amountInKobo = order.totalAmount * 100;

      // 14. Create Pending Database Record
      const tx = await this.paymentModel.create({
        idempotencyKey,
        amount: order.totalAmount,
        currency: 'NGN',
        status: PaymentStatus.PROCESSING,
        order: order._id,
        paymentType: PaymentTypes.ORDER
      });

      // 15. Initialize Transaction via Paystack
      const paystackRes = await this.paystackService.initializeTransaction(
        amountInKobo,
        idempotencyKey,
        { order: order._id, ...client },
        createPaymentDto.plan_code
      );

      // 16. Save Paystack reference
      tx.status = PaymentStatus.PROCESSING; // Remains pending until webhook or verification confirms success
      tx.providerTransactionId = paystackRes.reference;
      tx.responsePayload = paystackRes;
      await tx.save();

      const finalResult = {
        status: 'SUCCESS',
        reference: paystackRes.reference,
        authorizationUrl: paystackRes.authorization_url, // URL for frontend to complete checkout
      };

      // 17. Cache result in Redis
      await this.redisService.setCachedResponse(idempotencyKey, finalResult);

      // 18. Create customer in paystack
      await this.paystackService.createCustomer(client);

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Checkout Link',
        data: finalResult
      };

      return res;
    }
    catch(error: any) {
      // Optional: Update DB to FAILED if a transaction was created
      if (idempotencyKey) {
        await this.paymentModel.updateOne(
          { idempotencyKey, status: PaymentStatus.PROCESSING },
          { $set: { status: PaymentStatus.FAILED, responsePayload: { error: error.message } } }
        ).catch((err) => {
          this.logger.error('Failed to update transaction failure state', err);
        });
      }

      // Re-throw NestJS HTTP exceptions as-is, wrap others
      if (error.status) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Payment processing failed');
    } 
    finally {
      // Safely release distributed lock only if key was generated
      if(idempotencyKey){
        await this.redisService.releaseLock(idempotencyKey).catch((err) => {
          this.logger.error('Failed to release Redis lock', err);
        });;
      }
    }
  }

  async processSubscription(createPaymentDto: CreatePaymentDto, user: any, sub_id?: string) {
    try {      
      if(!createPaymentDto.idempotencyKey) {
        return `Idempotency key is required!`;
      }

      if(!createPaymentDto.amount) {
        return `Plan amount is required!`;
      }

      if(!user) {
        return `User account not provided!`;
      }

      const tx = await this.paymentModel.create({
        idempotencyKey: createPaymentDto.idempotencyKey,
        amount: createPaymentDto.amount,
        currency: 'NGN',
        status: PaymentStatus.PROCESSING,
        paymentType: PaymentTypes.SUBSCRIPTION,
        subscription: sub_id
      });

      const amountInKobo = createPaymentDto.amount * 100;
      const response = await this.paystackService.initializeTransaction(
        amountInKobo, 
        createPaymentDto.idempotencyKey, 
        {...user },
        createPaymentDto.plan_code
      );

      tx.responsePayload = response;
      await tx.save()

      this.logger.log(`Subscription payment initialized:`, tx);

      return response;
    } catch(error: any) {
      this.logger.log(error);
    } finally {
      this.logger.log('success');
    }
  }

  async verify(paymentId: string) {
    const response = await this.paystackService.verifyTransaction(paymentId);
    console.log(response);
  }

  async checkForTransaction(idempotencyKey: string) {
    // 1. Confirm idempotency key is provided 
    if (!idempotencyKey) {
      return {status: false, msg: 'idempotencyKey is required'};
    }

    // 2. Check Redis Cache
    const cachedResponse = await this.redisService.getCachedResponse(idempotencyKey);
    if (cachedResponse) {
      return {status: true, msg: `Transaction Cached!`, data: cachedResponse};
    }

    // 3. Check Database for Existing Transaction
    const existingTx = await this.paymentModel.findOne({ idempotencyKey });
    if(existingTx) {
      return { status: true, msg: 'Transaction Found!', data: existingTx.responsePayload};
    } else {
      return { status: false, msg: 'transaction not found'};
    }
  }

  async findAll() {
    try {
      const payments = await this.paymentModel
      .find()
      .populate('order')
      .populate('subscription')
      .exec();

      if(!payments) {
        throw new NotFoundException(`No payments have been recorded yet!`);
      }

      const res: IResponse<Payment[]> = {
        statusCode: 200,
        msg: 'List of all payments',
        data: payments
      } 

      return res;
    } catch(error: any) {
      this.logger.log(error);
      return error;
    }
  }

  async findOrderPayment(id: string) {
    try {
      const payment = await this.paymentModel.find({
        $or: [
          { order: id }
        ]
      });

      if(!payment) {
        throw new NotFoundException(`No payment found for this order!`);
      }

      const res: IResponse<Payment[]> = {
        statusCode: 200,
        msg: 'payment retrieved successfully!',
        data: payment
      } 

      return res;
    } catch(error: any) {
      this.logger.log(error);
      return error;
    }
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    console.log(updatePaymentDto);
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
