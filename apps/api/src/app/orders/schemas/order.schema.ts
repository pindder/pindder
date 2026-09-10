import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, HydratedDocument } from "mongoose";
import { Design } from "../../designs/schemas/design.schema";
import { Measurement } from "../../measurements/schemas/measurement.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Design })
    product!: Design;
    
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

    @Prop({ type: String, required: true, enum: [] })
    status!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);