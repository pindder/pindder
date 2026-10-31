import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, QueryFilter } from 'mongoose';
import { AccountTypes, DataTypes, DataTypesIcon, IOrderItem, IOrderStyle, IResponse, NotificationActions, OrderStatus, PaymentMethods } from '@pindder/contracts';
import { Client } from '../clients/schemas/client.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { generateCode } from '../shared/helpers';
import { Quote } from './schemas/quote.schema';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { NotificationService } from '../notifications/notification.service';
// import { OrderStatus } from '@pindder/contracts';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../users/schemas/user.schema';
import { PaymentService } from '../payments/payment.service';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Quote.name) private readonly quoteModel: Model<Quote>,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly notificationService: NotificationService,
    private readonly paymentService: PaymentService
  ) {}

  @OnEvent('order.payment.successful')
  async handleOrderPaymentFulfilled(payload: {
    email: string;
    amount: number;
    reference: string;
    subscriptionCode: string;
    metadata: any;
  }) {
    this.logger.log(`Processing successful subscription payment for ${payload.email}`);
    
    // TODO: Update database (e.g., set user's subscription status to 'active', 
    // save subscriptionCode, extend expiration date)
    
    // Example:
    // await this.userService.activateUserSubscription(payload.email, payload.subscriptionCode);
  }

  async create(createOrderDto: CreateOrderDto, user: any) {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      //console.log(createOrderDto);

      if(user.acctType === AccountTypes.TAILOR) {
        const tailor = await this.tailorModel.findById(user.sub).lean();
        const client = await this.clientModel.findById(createOrderDto.client).lean();

        if(!tailor || !client) {
          return;
        }

        newOrder.tailor = tailor;
        newOrder.client = client;
      } else if(user.acctType === AccountTypes.USER){
        const user = await this.userModel.findById(createOrderDto.user).lean();

        if(!user) {
          return;
        }

        newOrder.user = user;
      }

      const styles: any[] = [];

      createOrderDto.styles.forEach((style: IOrderStyle) => {
        styles.push(style)
      });
      
      newOrder.styles = styles;
      newOrder.orderId = `ORD-${generateCode(12)}`;
      await newOrder.save();

      if(newOrder.paymentMethod === PaymentMethods.ONLINE) {
        await this.paymentService.processOrderPayment({
          callbackUrl: '',
          orderId: newOrder._id.toString()
        });
      }

      await this.notificationService.create({
        initiator: user.acctType === AccountTypes.TAILOR ? newOrder.tailor : newOrder.user,
        dependent: user.acctType === AccountTypes.TAILOR ? newOrder.client : newOrder.tailor, 
        type: DataTypes.ORDER,
        action: NotificationActions.ORDER_CREATED,
        title: 'New Order',
        icon: DataTypesIcon.ORDER,
        message: `Order #${newOrder.orderId} has been created.`,
        data: {
          ...newOrder
        },
      });

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

  async createQuote(order_id: string, createQuoteDto: CreateQuoteDto) {
    try {
      const quote = new this.quoteModel(createQuoteDto);
      
      await quote.save();

      // const order = await this.orderModel.findByIdAndUpdate(order_id, {
      //   $push: { quotes: quote._id }
      // }, { upsert: true, returnDocument: 'after' });

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Quote created successfully',
        data: quote
      }

      return res;
    } catch(error: any) {
      console.log(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findOrderQuotes(order_id: string) {
    try {
      const quotes = await this.quoteModel.find({ order: order_id }).exec();

      if (!quotes || quotes.length === 0) {
        const res: IResponse<any> = {
          statusCode: 404,
          msg: 'No quotes found for this order',
          data: []
        }
  
        return res;
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Order quotes retrieved successfully',
        data: quotes
      }

      return res;
    } catch(error: any) {
      console.log(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async findAll(user: any, status?: string) {
    try {
      const filter: QueryFilter<Order> = {};

      if(user.acctType !== AccountTypes.ADMIN) {
        // 1. Build base filter matching user involvement
        filter.$or = [
          { 'tailor._id': user.sub },
          { 'client.id': user.sub },
          { 'user_id': user.sub },
        ];
      }

      // 2. Conditionally attach status filter if present
      if (status) {
        filter.status = status;
      }

      const orders = await this.orderModel
      .find(filter)
      .limit(20)
      .sort({ createdAt: -1 })
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
