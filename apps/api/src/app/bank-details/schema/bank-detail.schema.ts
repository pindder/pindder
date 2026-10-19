import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { HydratedDocument } from "mongoose";

export type BankDetailDocument = HydratedDocument<BankDetail>;

@Schema()
export class BankDetail {
    @Prop({ type: () => TailorSnapshot, required: true })
    tailor!: TailorSnapshot;

    @Prop({ type: String, required: true })
    bankName!: string;
    
    @Prop({ type: String, required: true })
    accountNo!: string;

    @Prop({ type: String, required: true })
    accountName!: string;

    @Prop({ type: String })
    sortCode?: string;

    @Prop({ type: String })
    withdrawalPin?: string;

    @Prop({ type: Boolean, default: true })
    disabled!: boolean;
}

export const BankDetailSchema = SchemaFactory.createForClass(BankDetail);