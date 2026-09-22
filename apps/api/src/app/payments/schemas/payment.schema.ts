import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Order } from "../../orders/schemas/order.schema";
import { Client } from "../../clients/schemas/client.schema";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { PaymentStatus } from "@pindder/contracts";

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ required: true, unique: true, index: true })
    idempotencyKey!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Order })
    order!: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    client?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    customer?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor!: string;

    @Prop({ required: true, type: Number })
    amount!: number;

    @Prop({ type: String })
    currency?: string;

    @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PROCESSING })
    status!: string;

    @Prop({ type: Object })
    responsePayload?: Record<string, any>;

    @Prop({ type: String })
    providerTransactionId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);