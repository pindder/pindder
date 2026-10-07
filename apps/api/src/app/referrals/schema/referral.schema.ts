import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TailorSnapshot } from '../../tailors/schemas/tailor.schema';

export type ReferralDocument = HydratedDocument<Referral>;

@Schema({ })
export class Referral {
    @Prop({ type: TailorSnapshot, required: true })
    referee!: TailorSnapshot;

    @Prop({ type: TailorSnapshot, required: true })
    referrer!: TailorSnapshot

    @Prop({ required: true })
    refereePlan!: string;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);