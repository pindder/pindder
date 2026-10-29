import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { Brand } from "../../brands/schemas/brand.schema";

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
    @Prop({ type: () => TailorSnapshot })
    tailor?: TailorSnapshot;

    @Prop({  type: mongoose.Schema.Types.ObjectId, ref: () => Brand })
    brand!: Types.ObjectId;

    @Prop({ type: String, required: true })
    addressLine1!: string;

    @Prop({ type: String })
    addressLine2?: string;

    @Prop({ type: String })
    country?: string;

    @Prop({ type: String })
    state?: string;

    @Prop({ type: String })
    city?: string;

    @Prop({ type: String })
    zipCode?: string;

    @Prop({ type: String })
    postalCode?: string;

    @Prop({ type: String })
    province?: string;

    @Prop({ type: Boolean, required: true, default: false })
    hq!: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);