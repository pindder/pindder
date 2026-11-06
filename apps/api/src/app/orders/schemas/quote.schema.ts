import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { Order } from "./order.schema";

export type QuoteDocument = HydratedDocument<Quote>;

@Schema({ _id: false })
export class Quote {
    @Prop({ type: String, required: true })
    note!: string;

    @Prop({ type: Number, required: true, default: 1 })
    amount!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor!: Tailor;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    customer!: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Order })
    order!: string;

    @Prop({ type: Number, required: true, default: 0 })
    satisfiedParties!: number;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);