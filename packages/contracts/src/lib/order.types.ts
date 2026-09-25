import { IClient } from "./client.types";
import { IDesign } from "./design.types";

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IOrder {
  id?: string;
  client: string;
  tailor?: string;
  styles: IOrderStyle[];
  deliveryDate: string | Date;
  measurement?: string;
  address?: string;
  deliveryMethod?: string;
  status: OrderStatus;
  note?: string;
  totalAmount: number;
  totalItems: number;
}

export interface IOrderItem {
  _id: string;
  client: IClient;
  tailor: any;
  user: any;
  styles: IOrderStyle[];
  deliveryDate: string | Date;
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
  styleId: string;
  design: IDesign;
  sizes?: string[];
  quantity: number;
  note?: string;
}