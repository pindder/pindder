import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { Payment } from "../../payments/schemas/payment.schema";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true })
export class Ledger {
    @Prop({ type: Number, required: true, default: 0 })
    balance!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor || User })
    account!: Types.ObjectId;

    @Prop({ type: String, required: true })
    transactionType!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Payment })
    transaction!: Types.ObjectId;

    @Prop({ type: String, required: true })
    status!: string;
}

export const LedgerSchema = SchemaFactory.createForClass(Ledger);