import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { OrderStatus } from '@pindder/contracts';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const newOrder = new this.orderModel(createOrderDto);

      newOrder.status = OrderStatus.PENDING;

      await newOrder.save();

      return newOrder;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  async filterByStatus(query: string) {
    try {
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitizedQuery, 'i');

      const orders = await this.orderModel.find({ 
        $or: [
          { status: searchRegex },
        ]
      }).exec();

      return orders;

    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
