import { IClient } from "./client.types";

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IOrder {
  _id?: string;
  client: string;
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
  client: IClient;
  tailor: any;
  user: any;
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
  sizes?: string[];
  selectedSizes: string[];
  colors?: string[];
  selectedColors?: string[];
  quantity: number;
  note?: string;
  catalogDisplay: boolean;
}