import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, QueryFilter } from 'mongoose';
import { IOrderItem, IOrderStyle, IResponse, OrderStatus } from '@pindder/contracts';
import { Client } from '../clients/schemas/client.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { generateCode } from '../shared/helpers';
// import { OrderStatus } from '@pindder/contracts';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id: any) {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      //console.log(createOrderDto);

      const client = await this.clientModel.findById(createOrderDto.client);
      const tailor = await this.tailorModel.findById(user_id);

      if(client) newOrder.client = client;
      if(tailor) newOrder.tailor = tailor;

      const styles: any[] = [];

      createOrderDto.styles.forEach((style: IOrderStyle) => {
        styles.push(style)
      });
      
      newOrder.styles = styles;
      newOrder.orderId = `ORD-${generateCode(12)}`;
      await newOrder.save();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Order created successfully',
        data: newOrder
      }

      return res;
    } catch(error: any) {
      console.log(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findAll(user_id: any, status?: string) {
    try {
      // 1. Build base filter matching user involvement
      const filter: QueryFilter<Order> = {
        $or: [
          { 'tailor._id': user_id },
          { 'client.id': user_id },
          { 'user_id': user_id },
        ]
      };

      // 2. Conditionally attach status filter if present
      if (status) {
        filter.status = status;
      }

      const orders = await this.orderModel
      .find(filter)
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

  async search(query: string) {
    try {
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitizedQuery, 'i');

      const orderFilter: QueryFilter<Order> = {
        $or: [
          { orderId: searchRegex },
          { status: searchRegex },
          { deliveryMethod: searchRegex },
          { 'client._id': searchRegex },
          { 'client.firstname': searchRegex },
          { 'client.lastname': searchRegex },
          { 'client.fullname': searchRegex },
          { 'tailor._id': searchRegex },
        ]
      };

      const orders = await this.orderModel
      .find(orderFilter)
      .populate('client')
      .populate('tailor')
      .exec();
      console.log(orders);

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

  async cancelOrder(id: string) {
    
    try{
      const order = await this.orderModel.findByIdAndUpdate(id, {
        status: OrderStatus.CANCELLED
      }, { upsert: true, returnDocument: 'after' });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Order Cancelled Successfully!',
        data: order
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
