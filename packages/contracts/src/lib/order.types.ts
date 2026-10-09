import { IClient } from "./client.types";
import { IColors, ISpecification } from "./design.types";

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
  measurement?: string;
  address?: string;
  deliveryMethod?: string;
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
  measurement?: string;
  address?: string;
  deliveryMethod?: string;
  status: OrderStatus;
  note?: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string | Date;
  updatedAt: string | Date;
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