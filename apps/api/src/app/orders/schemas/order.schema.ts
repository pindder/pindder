import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, HydratedDocument } from "mongoose";
//import { Measurement } from "../../measurements/schemas/measurement.schema";
import { DeliveryMethods, OrderStatus } from "@pindder/contracts";
import { Client } from "../../clients/schemas/client.schema";
import { User } from "../../users/schemas/user.schema";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { Design } from "../../designs/schemas/design.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    client?: Client;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    user?: User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor?: Tailor;

    @Prop({ type: [Design],  })
    styles!: Design[];

    @Prop({ type: mongoose.Schema.Types.Date, required: true })
    deliveryDate!: Date;

    @Prop({ type: String, required: true, enum: DeliveryMethods, default: DeliveryMethods.PICKUP })
    deliveryMethod!: string;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Measurement })
    // measurement?: Measurement;

    @Prop({ type: [String], required: true })
    sizes?: string;

    @Prop({ type: Number, required: true, default: 1 })
    quantity!: number;

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