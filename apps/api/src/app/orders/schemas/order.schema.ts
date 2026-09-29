import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
//import { Measurement } from "../../measurements/schemas/measurement.schema";
import { DeliveryMethods, OrderStatus } from "@pindder/contracts";
import { Client, ClientSnapshot } from "../../clients/schemas/client.schema";
import { User, UserSnapshot } from "../../users/schemas/user.schema";
import { Tailor, TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { OrderStyleSnapshot } from "../../designs/schemas/design.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: String, required: true, unique: true, index: true })
    orderId!: string;

    @Prop({ type: ClientSnapshot, required: false })
    client?: Client;

    @Prop({ type: UserSnapshot, required: false })
    user?: User;

    @Prop({ type: TailorSnapshot, required: false })
    tailor?: Tailor;

    @Prop({ type: [OrderStyleSnapshot] })
    styles!: OrderStyleSnapshot[];

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