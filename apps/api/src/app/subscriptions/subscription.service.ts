import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './schemas/subscription.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const newSub = new this.subscriptionModel(createSubscriptionDto);

      await newSub.save();

      return newSub;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async createSubscriptionPlan() {

  }

  async initializeSubscriptionPayment() {
    const response = await this.httpService.post(
      'https://api.paystack.co/transaction/initialize',
      {
        //email: user.email,
        amount: 500000,
        plan: 'PLN_8690x10a83v0312', // Links this payment to recurring subscription
        callback_url: 'https://yourdomain.com/app/orders'
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      }
    );

    return response;
  }

  async findAll() {
    try {
      const subs = await this.subscriptionModel.find()

      return subs;
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
