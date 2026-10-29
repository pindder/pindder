import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './schemas/subscription.schema';
import { Model } from 'mongoose';
import { PaymentService } from '../payments/payment.service';
import { IResponse, PaymentStatus, PaymentTypes, SubscriptionProviders, SubscriptionStatus } from '@pindder/contracts';
import { generateCode } from '../shared/helpers';
import { OnEvent } from '@nestjs/event-emitter';
import { Plan } from '../plans/schema/plan.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { AssignSubscriptionDto } from './dto/assign-subscription.dto';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly paymentService: PaymentService,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  @OnEvent('subscription.payment.successful')
  async handleSubscriptionFulfilled(payload: {
    email: string;
    amount: number;
    reference: string;
    subscriptionCode: string;
    metadata: any;
  }) {
    this.logger.log(`Processing successful subscription payment for ${payload.email}`);
    
    const subscription = await this.subscriptionModel.findOne({ plan: payload.metadata.plan });

    if(!subscription) {
      this.logger.error(`Subscription not found!`);
      return;
    }

    subscription.paystackSubscriptionMetadata = payload.metadata;
    subscription.status = SubscriptionStatus.active;

    await subscription.save();
    return;
  }

  async assignSubscription(assignSubscriptionDto: AssignSubscriptionDto, activity?: string) {
    try {
      let selected_plan; 

      if(assignSubscriptionDto.plan_id) {
        selected_plan = await this.planModel.findById(assignSubscriptionDto.plan_id);
      } else {
        selected_plan = await this.planModel.findOne({ free: true });
      }

      if(!selected_plan) {
        throw new NotFoundException(`Plan not found!`);
      }

      const tailor = await this.tailorModel.findById(assignSubscriptionDto.user_id);

      if(!tailor) {
        throw new NotFoundException(`Tailor not found!`);
      }

      let subscription;
      subscription = await this.subscriptionModel.findOne({ 'tailor._id': tailor._id });

      if(subscription) {
        subscription.plan = selected_plan;
        subscription.status = SubscriptionStatus.active;
        
        await subscription.save()

      } else {
        subscription = await this.subscriptionModel.create({
          tailor: tailor,
          plan: selected_plan,
          provider: SubscriptionProviders.paystack,
          status: SubscriptionStatus.active,
        });

        await subscription.save();

      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: `${subscription.plan.name} subscription activated for ${subscription.tailor.fullname}`,
        data: subscription
      }

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async create(createSubscriptionDto: CreateSubscriptionDto, user: any) {
    const res: IResponse<any> = {
      statusCode: 200,
      msg: '',
    };

    try {
      const idempotencyKey = generateCode(12);
      const userDoc = await this.tailorModel.findById(user.sub);
      
      if(!userDoc) {
        throw new NotFoundException('Account not found.');
      }

      const acct = userDoc.toObject();
      const planDoc = await this.planModel.findOne({ plan_id: createSubscriptionDto.plan_id });
      
      if(!planDoc) {
        throw new NotFoundException('Plan not found.');
      }

      const plan = planDoc.toObject();
      const subscription = await this.subscriptionModel.findOne({ 'tailor._id': user.sub });

      if(!subscription) {
        const newSubscription = await this.subscriptionModel.create({
          tailor: acct,
          plan: plan,
          provider: SubscriptionProviders.paystack,
          status: SubscriptionStatus.none,
        });

        res.data = await this.subscribe(
          {...createSubscriptionDto, idempotencyKey: idempotencyKey, plan_code: plan.plan_code }, 
          acct, plan.amount, 
          newSubscription._id.toString()
        );

        return res;
      }
      
      if(subscription.status === SubscriptionStatus.active) {
        this.logger.log(`User already has an active subscription:`, subscription);
        res.msg = `User already has an active subscription`;
        return res;
      }

      if(plan.plan_code !== subscription.plan.plan_code) {
        subscription.plan = plan;
        subscription.status = SubscriptionStatus.none;

        await subscription.save();

        this.logger.log(`Subscription updated:`, subscription);

        res.data = await this.subscribe(
          {...createSubscriptionDto, idempotencyKey: idempotencyKey, plan_code: plan.plan_code },  
          acct, plan.amount, 
          subscription._id.toString()
        );
        
        return res;
      }

      await this.paymentModel.updateMany({ 
        $and: [
          { paymentType: PaymentTypes.SUBSCRIPTION },
          { 'tailor._id': acct._id },
          { status: PaymentStatus.PROCESSING },
          { subscription: subscription._id }
        ]
      }, { $set: { status: PaymentStatus.ABANDONED }});

      res.data = await this.subscribe(
        {...createSubscriptionDto, idempotencyKey: idempotencyKey, plan_code: plan.plan_code },  
        acct, plan.amount, 
        subscription._id.toString()
      );

      return res;
    } catch(error: any) {
      this.logger.error('Failed to create Paystack plan', error.response?.data);
      throw new InternalServerErrorException(error);
    }
  }

  async subscribe(createSubscriptionDto: CreateSubscriptionDto, acct: any, amount: number, sub_id?: string) {
    const response = await this.paymentService
      .processSubscription(
        {
          ...createSubscriptionDto, 
          amount: amount,           
          idempotencyKey: createSubscriptionDto.idempotencyKey,
          plan_code: createSubscriptionDto.plan_code
        }, 
        acct,
        sub_id
      );

    const res: IResponse<any> = {
      statusCode: 200,
      msg: 'Checkout Url',
      data: response
    };

    return res;
  }

  async findAll() {
    try {
      const subs = await this.subscriptionModel
      .find()
      .populate('plan')
      .exec();

      if(!subs) {
        throw new NotFoundException(`No subscriptions found!`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of all subscriptions',
        data: subs
      };

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async filterByStatus(query: string) {
    try {
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitizedQuery, 'i');

      const subs = await this.subscriptionModel.find({
        $or: [
          { status: searchRegex },
          { name: searchRegex },
        ]
      });

      return subs;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
