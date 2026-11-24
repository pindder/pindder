import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Bank } from "../../payments/schemas/bank";

export type BankDetailDocument = HydratedDocument<BankDetail>;

@Schema()
export class BankDetail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor!: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Bank })
    bank!: Types.ObjectId;
    
    @Prop({ type: String, required: true })
    accountNo!: string;

    @Prop({ type: String, required: true })
    accountName!: string;

    @Prop({ type: Object, required: true })
    meta!: Record<string, any>;
}

export const BankDetailSchema = SchemaFactory.createForClass(BankDetail);