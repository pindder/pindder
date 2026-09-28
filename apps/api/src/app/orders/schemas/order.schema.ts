import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
//import { Measurement } from "../../measurements/schemas/measurement.schema";
import { DeliveryMethods, DesignTypes, OrderStatus, Sizes } from "@pindder/contracts";
import { Client } from "../../clients/schemas/client.schema";
import { User } from "../../users/schemas/user.schema";
import { Tailor } from "../../tailors/schemas/tailor.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({})
export class OrderStyle {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: [String], required: true })
    images!: [string];

    @Prop({ type: String, required: true, enum: DesignTypes })
    type!: string;

    @Prop({ type: [String], enum: Sizes, required: true })
    sizes!: [string];

    @Prop({ type: [String], required: true })
    selectedSizes!: [string];

    @Prop({ type: Date })
    dueDate!: Date; 

    @Prop({ type: Number })
    amount!: number;

    @Prop({ type: Number })
    quantity!: number;

    @Prop({ type: String })
    note?: string;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: String, required: true})
    orderId!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    client?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    user?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor?: string;

    @Prop({ type: [OrderStyle] })
    styles!: OrderStyle[];

    @Prop({ type: mongoose.Schema.Types.Date, required: true })
    dueDate!: Date;

    @Prop({ type: String, required: true, enum: DeliveryMethods, default: DeliveryMethods.PICKUP })
    deliveryMethod!: string;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Measurement })
    // measurement?: Measurement;

    @Prop({ type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
    status!: string;

    @Prop({ type: Number })
    totalAmount!: number;

    @Prop({ type: Number })
    totalItems!: number;

    @Prop({ type: String })
    note?: string

    @Prop({ type: String })
    address?: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);