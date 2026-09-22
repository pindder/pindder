import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { RedisService } from '../shared/redis.service';
import { PaymentStatus } from '@pindder/contracts';
import { PaystackService } from '../shared/paystack.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private redisService: RedisService,
    private paystackService: PaystackService
  ) {}

  async processOrderPayment(dto: {
    idempotencyKey: string;
    client: string;
    email: string;
    amountInNaira: number;
    orderId: string;
  }) {
    const { idempotencyKey, client, email, amountInNaira, orderId } = dto;

    if (!idempotencyKey) {
      throw new BadRequestException('x-idempotency-key header is required');
    }

    // 1. Check Redis Cache
    const cachedResponse = await this.redisService.getCachedResponse(idempotencyKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. Check Database for Existing Transaction
    const existingTx = await this.paymentModel.findOne({ idempotencyKey });
    if (existingTx && existingTx.status !== PaymentStatus.PROCESSING) {
      const response = {
        status: existingTx.status,
        reference: existingTx.providerTransactionId,
        data: existingTx.responsePayload,
      };
      await this.redisService.setCachedResponse(idempotencyKey, response);
      return response;
    }

    // 3. Acquire Distributed Lock (30s TTL)
    const lockAcquired = await this.redisService.acquireLock(idempotencyKey, 30);
    if (!lockAcquired) {
      throw new ConflictException('Payment request is already processing. Please wait.');
    }

    try {
      // Convert Naira to Kobo for Paystack
      const amountInKobo = amountInNaira * 100;

      // Create Pending Database Record
      let tx = existingTx;
      if (!tx) {
        tx = await this.paymentModel.create({
          idempotencyKey,
          client,
          amount: amountInNaira,
          currency: 'NGN',
          status: PaymentStatus.PROCESSING,
        });
      }

      // 4. Initialize Transaction via Paystack
      const paystackRes = await this.paystackService.initializeTransaction(
        email,
        amountInKobo,
        idempotencyKey,
        { orderId, client }
      );

      // Save Paystack reference
      tx.status = PaymentStatus.PROCESSING; // Remains pending until webhook or verification confirms success
      tx.providerTransactionId = paystackRes.data.reference;
      tx.responsePayload = paystackRes.data;
      await tx.save();

      const finalResult = {
        status: 'SUCCESS',
        reference: paystackRes.data.reference,
        authorizationUrl: paystackRes.data.authorization_url, // URL for frontend to complete checkout
      };

      // Cache result in Redis
      await this.redisService.setCachedResponse(idempotencyKey, finalResult);

      return finalResult;
    } finally {
      // Always release lock
      await this.redisService.releaseLock(idempotencyKey);
    }
  }

  async processPayment(dto: CreatePaymentDto) {
    const { idempotencyKey, client, amount, currency } = dto;

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required.');
    }

    // 1. Check Redis cache for fast response on repeated client retries
    const cachedResponse = await this.redisService.getCachedResponse(idempotencyKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. Check Database for existing completed/failed payment
    const existingTx = await this.paymentModel.findOne({ idempotencyKey });
    if (existingTx && existingTx.status !== PaymentStatus.PROCESSING) {
      const response = {
        status: existingTx.status,
        transactionId: existingTx.providerTransactionId,
        amount: existingTx.amount,
        responsePayload: existingTx.responsePayload,
      };
      // Warm Redis cache
      await this.redisService.setCachedResponse(idempotencyKey, response);
      return response;
    }

    // 3. Acquire Distributed Lock (prevents concurrent race conditions)
    const lockAcquired = await this.redisService.acquireLock(idempotencyKey, 30);
    if (!lockAcquired) {
      throw new ConflictException('Payment processing is currently in progress. Please wait.');
    }

    try {
      // 4. Create or update record as PENDING
      let tx = existingTx;
      if (!tx) {
        tx = await this.paymentModel.create({
          idempotencyKey,
          client,
          amount,
          currency,
          status: PaymentStatus.PROCESSING,
        });
      }

      // 5. Call External Payment Gateway (e.g., Stripe, Paystack)
      const chargeResult = await this.executeGatewayCharge(client!, amount, currency!, idempotencyKey);

      // 6. Update DB with success result
      tx.status = PaymentStatus.SUCCESS;
      tx.providerTransactionId = chargeResult.id;
      tx.responsePayload = chargeResult;
      await tx.save();

      const finalResponse = {
        status: PaymentStatus.SUCCESS,
        transactionId: chargeResult.id,
        amount: tx.amount,
        responsePayload: chargeResult,
      };

      // 7. Cache in Redis
      await this.redisService.setCachedResponse(idempotencyKey, finalResponse);

      return finalResponse;
    } catch (error: any) {
      // Record failure state if payment gateway failed
      await this.paymentModel.updateOne(
        { idempotencyKey },
        { $set: { status: PaymentStatus.FAILED, responsePayload: { error: error.message } } }
      );
      throw new InternalServerErrorException(error.message || 'Payment processing failed');
    } finally {
      // 8. Always release distributed lock
      await this.redisService.releaseLock(idempotencyKey);
    }
  }

  private async executeGatewayCharge(userId: string, amount: number, currency: string, idempotencyKey: string) {
    // Example Stripe/Paystack call
    // Note: Most gateways (like Stripe) accept an idempotency key directly in request headers:
    // { headers: { 'Idempotency-Key': idempotencyKey } }
    return { id: `ch_${Date.now()}`, status: 'succeeded', amount, currency };
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
