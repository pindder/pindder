// apps/api/src/payments/schemas/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Tailor } from '../../tailors/schemas/tailor.schema';
import { Client } from '../../clients/schemas/client.schema';
import { User } from '../../users/schemas/user.schema';
import { Order } from '../../orders/schemas/order.schema';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: String, required: true, unique: true })
  txRef!: string; 

  @Prop({ type: String, required: true })
  currency!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
  tailor!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client || User })
  client!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Order })
  order!: Types.ObjectId;

  @Prop({ type: String, required: true })
  amount!: string;

  @Prop({ type: String, required: true, default: 'pending' })
  status!: string; // 'pending', 'succeeded', 'failed'

  @Prop({ type: String, required: true })
  checkoutUrl!: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Store custom context passed to Stripe
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);