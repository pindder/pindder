import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, QueryFilter } from 'mongoose';
import { IOrderItem, IOrderStyle, IResponse, OrderStatus } from '@pindder/contracts';
import { Client } from '../clients/schemas/client.schema';
// import { OrderStatus } from '@pindder/contracts';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id: any) {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      //console.log(createOrderDto);

      const styles: any[] = [];

      createOrderDto.styles.forEach((style: IOrderStyle) => {
        styles.push(style)
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

  async findAll(user_id: any, status?: string) {
    try {
      // 1. Build base filter matching user involvement
      const filter: QueryFilter<Order> = {
        $or: [
          { tailor: user_id },
          { client: user_id },
          { user: user_id },
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

      // 1. Build base filter matching user involvement
      const clientFilter: QueryFilter<Client> = {
        $or: [
          { firstname: searchRegex },
          { lastname: searchRegex },
          { email: searchRegex },
          { fullname: searchRegex }
        ]
      };

      const orderFilter: QueryFilter<Order> = {
        $or: [
          { orderId: searchRegex },
          { status: searchRegex },
          { deliveryMethod: searchRegex }
        ]
      };

      const client = await this.clientModel.findOne(clientFilter).exec();
      console.log(client);

      // if client exists add client id to order query filter
      if(client) {
        orderFilter.client = client._id.toString();
      }
      console.log(orderFilter);

      const orders = await this.orderModel
      .find(orderFilter)
      .populate('client')
      .populate('tailor')
      .exec();
      console.log(orders);

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
