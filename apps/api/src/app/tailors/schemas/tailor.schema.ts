import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AccountStatus, AccountTypes } from "@pindder/contracts";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

export type TailorDocument = HydratedDocument<Tailor>;

@Schema()
export class TailorSnapshot {
    @Prop({ type: String, required: true })
    _id!: string;

    @Prop({ type: String, required: true })
    fullname!: string;

    @Prop({ required: false })
    firstname?: string;

    @Prop({ required: false })
    lastname?: string;

    @Prop({ required: true })
    username!: string;

    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    phoneNo!: string;

    @Prop({ required: false })
    mobile?: string;

    @Prop({ type: String })
    catalog?: string;

    @Prop({ type: String, required: true })
    accountType!: string;

    @Prop({ type: String })
    profileImg?: string;

    @Prop({ type: String, required: true })
    status!: string;
}

@Schema({ timestamps: true })
export class Tailor {
    @Prop({ type: String, default: () => randomUUID() })
    _id!: string;

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: String, required: true })
    fullname!: string;

    @Prop({ required: false })
    firstname?: string;

    @Prop({ required: false })
    lastname?: string;

    @Prop({ required: true })
    username!: string;

    @Prop({ required: true, unique: true, index: true })
    email!: string;

    @Prop({ required: true })
    phoneNo!: string;

    @Prop({ required: false })
    mobile?: string;

    @Prop({ type: String })
    catalog?: string;

    @Prop({ type: String })
    oneTimeLoginCode?: string;

    @Prop({ type: String })
    website?: string;

    @Prop({ type: String, enum: AccountTypes, required: true })
    accountType!: string;

    @Prop({ type: String })
    profileImg?: string;

    @Prop({ required: true, enum: AccountStatus, default: AccountStatus.PENDING })
    status!: string;
}

export const TailorSchema = SchemaFactory.createForClass(Tailor);