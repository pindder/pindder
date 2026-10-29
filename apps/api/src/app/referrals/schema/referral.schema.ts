import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TailorSnapshot } from '../../tailors/schemas/tailor.schema';
import { SubscriptionSnapshot } from '../../subscriptions/schemas/subscription.schema';

export type ReferralDocument = HydratedDocument<Referral>;

@Schema({ timestamps: true })
export class Referral {
    @Prop({ type: () => TailorSnapshot, required: true })
    referee!: TailorSnapshot;

    @Prop({ type: () => TailorSnapshot, required: true })
    referrer!: TailorSnapshot

    @Prop({ type: () => SubscriptionSnapshot })
    refereeSubscription?: Types.ObjectId;

    @Prop({ type: Boolean, default: false })
    redeemed!: boolean;
    
    @Prop({ type: Number, required: true })
    percentage!: number;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);