import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './schemas/subscription.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionService {
  constructor(
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
