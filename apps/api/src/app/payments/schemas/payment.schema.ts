import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Order } from "../../orders/schemas/order.schema";
import { PaymentStatus, PaymentTypes } from "@pindder/contracts";
import { Subscription } from "../../subscriptions/schemas/subscription.schema";

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: String, required: true, unique: true, index: true })
    idempotencyKey!: string;

    @Prop({ type: String, required: true, enum: PaymentTypes })
    paymentType!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Order })
    order?: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Subscription })
    subscription?: Types.ObjectId;

    @Prop({ required: true, type: Number })
    amount!: number;

    @Prop({ type: String })
    currency?: string;

    @Prop({ type: String, required: true, enum: PaymentStatus, default: PaymentStatus.PROCESSING })
    status!: string;

    @Prop({ type: Object })
    responsePayload?: Record<string, any>;

    @Prop({ type: String })
    providerTransactionId?: string;

    @Prop({ type: Object })
    metadata?: Record<string, any>;
}

export class PaymentSnapshot extends Payment { };

export const PaymentSchema = SchemaFactory.createForClass(Payment);