import { ITailor } from "./admin.interfaces";
import { IClient, IMeasurement } from "./client.types";
import { IColors, ISpecification } from "./design.types";
import { PaymentStatus } from "./enum.types";

export enum OrderStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface IOrder {
  _id?: string;
  client: string | null;
  tailor?: string;
  styles: IOrderStyle[];
  dueDate: string | Date;
  measurements?: IMeasurement[];
  address?: string;
  deliveryMethod?: string;
  paymentMethod: string;
  paid?: boolean;
  status: OrderStatus;
  note?: string;
  totalAmount: number;
  totalItems: number;
}

export interface IOrderItem {
  orderId: string;
  _id: string;
  client?: IClient;
  tailor?: any;
  user?: any;
  styles: IOrderStyle[];
  dueDate: string | Date;
  measurements?: IMeasurement[];
  address?: string;
  deliveryMethod?: string;
  status: OrderStatus;
  paid: boolean;
  paymentMethod: string;
  note?: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  quotes?: any[];
}

export interface IPayment {
  _id?: string;
  currency?: string;
  idempotencyKey?: string;
  orderId?: string;
  plan_id?: number;
  amount?: number;
  callbackUrl: string; 
  order?: IOrderItem;
  tailor?: ITailor;
  client?: IClient;
  responsePayload?: any;
  startDate?: string;
  status?: PaymentStatus;
  createdAt?: string;
  authorization?: string;
}

export interface IOrderWithPayment {
  order?: IOrderItem;
  payment?: IPayment[];
}

export interface IOrderStyle {
  _id?: string;
  name: string;
  description: string;
  images: any[];
  type: string;
  dueDate: string;
  amount: number;
  specifications: ISpecification[];
  selections: ISpecification[];
  colors: IColors[];
  selectedColors: IColors[];
  quantity: number;
  note?: string;
  totalAmount: number;
  totalItems: number;
  catalogDisplay: boolean;
}

export interface IQuote {
  _id?: string;
  note: string;
  amount: number;
  tailor: any;
  customer: any;
  order: string;
}

export type IOrderType = 'Bespoke' | 'Ready to Wear' | 'Mixed';
export type OrderStatuses = 'Ongoing' | 'Completed' | 'Overdue' | 'Pending' | 'Cancelled';