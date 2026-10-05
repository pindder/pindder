import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { UserSnapshot } from "../../users/schemas/user.schema";
import { Order } from "./order.schema";

export type QuoteDocument = HydratedDocument<Quote>;

@Schema({ _id: false })
export class Quote {
    @Prop({ type: String, required: true })
    note!: string;

    @Prop({ type: Number, required: true, default: 1 })
    amount!: number;

    @Prop({ type: TailorSnapshot, required: true })
    tailor!: TailorSnapshot;

    @Prop({ type: UserSnapshot, required: true })
    customer!: UserSnapshot;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Order })
    order!: string;

    @Prop({ type: Number, required: true, default: 0 })
    satisfiedParties!: number;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);