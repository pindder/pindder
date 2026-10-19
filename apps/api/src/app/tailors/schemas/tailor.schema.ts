import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AccountStatus, AccountTypes } from "@pindder/contracts";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

export type TailorDocument = HydratedDocument<Tailor>;

@Schema()
export class TailorSnapshot {
    @Prop({ type: String })
    _id!: string;

    @Prop({ type: String })
    fullname?: string;

    @Prop({ type: String })
    firstname?: string;

    @Prop({ type: String })
    lastname?: string;

    @Prop({ type: String })
    username!: string;

    @Prop({ type: String })
    email!: string;

    @Prop({ type: String })
    countryCode!: string;

    @Prop({ type: String })
    tel?: string;

    @Prop({ type: String })
    accountType!: string;

    @Prop({ type: String })
    profileImg?: string;
}

@Schema({ timestamps: true })
export class Tailor {
    @Prop({ type: String, default: () => randomUUID() })
    _id!: string;

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: String, required: true })
    fullname!: string;

    @Prop({ type: String, required: false })
    firstname?: string;

    @Prop({ type: String, required: false })
    lastname?: string;

    @Prop({ type: String, required: true })
    username!: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    email!: string;

    @Prop({ type: String, required: true })
    countryCode!: string;

    @Prop({ type: String, required: true })
    tel?: string;

    @Prop({ type: String })
    catalog?: string;

    @Prop({ type: String })
    oneTimeLoginCode?: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    referralCode!: string;

    @Prop({ type: String })
    website?: string;

    @Prop({ type: String, enum: AccountTypes, required: true })
    accountType!: string;

    @Prop({ type: String })
    profileImg?: string;

    @Prop({ type: String, required: true, enum: AccountStatus, default: AccountStatus.PENDING })
    status!: string;
}

export const TailorSchema = SchemaFactory.createForClass(Tailor);

// 1. Keep standard Virtual definition
TailorSchema.virtual('subscription', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'tailor._id',
});

// 2. Enable virtuals in output
TailorSchema.set('toJSON', { virtuals: true });
TailorSchema.set('toObject', { virtuals: true });

// 3. Keep Auto-Populate Pre-Hooks
function autoPopulateSubscription(this: any) {
    this.populate('subscription');
}

TailorSchema.pre('findOne', autoPopulateSubscription);
TailorSchema.pre('find', autoPopulateSubscription);