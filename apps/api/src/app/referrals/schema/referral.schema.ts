import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Tailor } from '../../tailors/schemas/tailor.schema';
import { SubscriptionSnapshot } from '../../subscriptions/schemas/subscription.schema';

export type ReferralDocument = HydratedDocument<Referral>;

@Schema({ timestamps: true })
export class Referral {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    referee!: Tailor;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    referrer!: Tailor;

    @Prop({ type: () => SubscriptionSnapshot })
    refereeSubscription?: Types.ObjectId;

    @Prop({ type: Boolean, default: false })
    redeemed!: boolean;
    
    @Prop({ type: Number, required: true })
    percentage!: number;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);