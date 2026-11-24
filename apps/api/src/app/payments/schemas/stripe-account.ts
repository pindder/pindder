import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";

@Schema({ timestamps: true })
export class StripeAccount extends Document {
    @Prop({ type: String })
    accountId!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    owner!: Types.ObjectId;

    @Prop({ type: String })
    accountType!: string;

    @Prop({ type: Object, required: false, default: null })
    metadata?: Record<string, any>; 

    @Prop({ type: String })
    onboardingLink!: string;

    @Prop({ type: String })
    loginLink!: string; 
}

export const StripeAccountSchema = SchemaFactory.createForClass(StripeAccount);