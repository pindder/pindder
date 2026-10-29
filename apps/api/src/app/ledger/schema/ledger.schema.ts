import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { UserSnapshot } from "../../users/schemas/user.schema";
import { PaymentSnapshot } from "../../payments/schemas/payment.schema";

@Schema({ timestamps: true })
export class Ledger {
    @Prop({ type: Number, required: true, default: 0 })
    balance!: number;

    @Prop({ type: () => TailorSnapshot || UserSnapshot, required: true })
    account!: TailorSnapshot | UserSnapshot;

    @Prop({ type: String, required: true })
    transactionType!: string;

    @Prop({ type: () => PaymentSnapshot, required: true })
    transaction!: PaymentSnapshot;

    @Prop({ type: String, required: true })
    status!: string;
}

export const LedgerSchema = SchemaFactory.createForClass(Ledger);