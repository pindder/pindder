import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, HydratedDocument } from "mongoose";
import { Design } from "../../designs/schemas/design.schema";
import { Measurement } from "../../measurements/schemas/measurement.schema";
import { OrderStatus } from "@pindder/contracts";
import { Client } from "../../clients/schemas/client.schema";
import { User } from "../../users/schemas/user.schema";
import { Tailor } from "../../tailors/schemas/tailor.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    client?: Client;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    user?: User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor?: Tailor;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => Design })
    designs!: Design;
    
    @Prop({ type: Number })
    amount!: number;

    @Prop({ type: mongoose.Schema.Types.Date, required: true })
    deliveryDate!: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Measurement })
    measurement?: Measurement;

    @Prop({ type: String, enum: [] })
    size?: string;

    @Prop({ type: Number, required: true, default: 1 })
    units!: number;

    @Prop({ type: String, required: true, enum: Object.values(OrderStatus) })
    status!: string;

    @Prop({ type: Number })
    total!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);