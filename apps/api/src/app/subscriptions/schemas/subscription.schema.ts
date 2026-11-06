import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { SubscriptionProviders, SubscriptionStatus } from "@pindder/contracts";
import { PlanSnapshot } from "../../plans/schema/plan.schema";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Subscription {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    tailor!: Tailor;

    @Prop({ type: () => PlanSnapshot, required: true })
    plan!: PlanSnapshot;

    @Prop({ type: String, enum: SubscriptionProviders, default: SubscriptionProviders.paystack, required: true })
    provider!: string;

    @Prop({ type: String, enum: SubscriptionStatus, default: SubscriptionStatus.none, required: true })
    status!: string;

    @Prop({ type: String })
    appleOriginalTransactionId?: string; // e.g. 1000000123456789

    @Prop({ type: Object })
    appleSubscriptionMetadata?: Record<string, any>;

    @Prop({ type: Object })
    paystackSubscriptionMetadata?: Record<string, any>;
}
@Schema({ })
export class SubscriptionSnapshot extends Subscription{ }

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);