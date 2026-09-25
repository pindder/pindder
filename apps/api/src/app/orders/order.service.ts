import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { IOrderItem, IOrderStyle, IResponse } from '@pindder/contracts';
// import { OrderStatus } from '@pindder/contracts';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id: any) {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      //console.log(createOrderDto);

      const styles: any[] = [];

      createOrderDto.styles.forEach((style: IOrderStyle) => {
        styles.push(style.design)
      });
      
      newOrder.styles = styles;
      newOrder.tailor = user_id;
      await newOrder.save();

      return newOrder;
    } catch(error: any) {
      console.log(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findAll(user_id: any) {
    try {
      const orders = await this.orderModel
      .find({
        $or: [
          { tailor: user_id },
          { client: user_id },
          { user: user_id }
        ]
      })
      .populate('client')
      .populate('tailor')
      .exec();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of orders',
        data: orders,        
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
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

  async findOne(id: string) {
    try {
      const order = await this.orderModel
      .findById(id)
      .populate('client')
      .populate('tailor')
      .exec();

      const res: IResponse<IOrderItem | any> = {
        statusCode:  200,
        msg: 'Order Item',
        data: order
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    return order;
  }
}
