import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { SubscriptionProviders, SubscriptionStatus } from "@pindder/contracts";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
    @Prop({ type: TailorSnapshot, required: true })
    tailor!: string;

    @Prop({ type: [String], required: true })
    featureList!: [string]; 

    @Prop({ })
    amount!: string;

    @Prop({ type: String, enum: SubscriptionProviders, default: SubscriptionProviders.paystack, required: true })
    Provider!: string;

    @Prop({ type: String, enum: SubscriptionStatus, default: SubscriptionStatus.none, required: true })
    status!: string;

    // Provider-specific references
    @Prop({ type: String })
    paystackSubscriptionCode?: string; // e.g. SUB_v42et9284

    @Prop({ type: String })
    paystackEmailToken?: string;

    @Prop({ type: String })
    appleOriginalTransactionId?: string; // e.g. 1000000123456789

    // Access control
    @Prop({ type: String })
    planId!: string;

    @Prop({ type: mongoose.Schema.Types.Date })
    currentPeriodStartsAt!: Date;

    @Prop({ type: mongoose.Schema.Types.Date })
    currentPeriodEndsAt!: Date;

    @Prop({ type: Boolean })
    cancelAtPeriodEnd!: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);