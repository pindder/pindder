export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IOrder {
  id?: string;
  productId: string;
  amount: number;
  deliveryDate: string | Date;
  measurementId?: string;
  size?: string;
  units: number;
  status: OrderStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}