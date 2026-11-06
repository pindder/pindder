import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { DesignTypes } from "@pindder/contracts";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { ColorSnapshot } from "../../colors/schema/color.schema";

export type DesignDocument = HydratedDocument<Design>;

@Schema({ _id: false })
export class SpecificationSnapshot {
    @Prop({ type: String })
    size?: string;

    @Prop({ type: Number })
    quantity?: number;

    @Prop({ type: () => [ColorSnapshot] })
    colors?: ColorSnapshot[];

    @Prop({ type: () => [ColorSnapshot] })
    selectedColors?: ColorSnapshot[];

    @Prop({ type: Number })
    inStock?: number;

    @Prop({ type: Number })
    amount?: number;
}

@Schema({ _id: false })
export class Specification {
    @Prop({ type: String, required: false })
    size!: string;

    @Prop({ type: String, required: false})
    description?: string;

    @Prop({ type: () => [ColorSnapshot] })
    colors?: ColorSnapshot[];

    @Prop({ type: Number, required: false })
    inStock?: number;

    @Prop({ type: Number, required: false })
    amount?: number;
}

@Schema({})
export class OrderStyleSnapshot {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: [String] })
    images!: [string];

    @Prop({ type: String, enum: DesignTypes })
    type!: string;

    @Prop({ type: () => [Specification] })
    specifications?: [Specification];

    @Prop({ type: () => [SpecificationSnapshot] })
    selections?: SpecificationSnapshot[];

    @Prop({ type: Date })
    dueDate!: Date; 

    @Prop({ type: Number })
    amount!: number;

    @Prop({ type: Number })
    estimatedProductionDays?: number; 

    @Prop({ type: Number })
    estimatedDeliveryDays?: number; 

    @Prop({ type: Number })
    quantity!: number;

    @Prop({ type: () => [ColorSnapshot] })
    selectedColors?: ColorSnapshot[]

    @Prop({ type: () => [ColorSnapshot] })
    colors?: ColorSnapshot[]

    @Prop({ type: String })
    note?: string;

    @Prop({ type: Number })
    totalAmount!: number;

    @Prop({ type: Number })
    totalItems!: number;

    @Prop({ type: Boolean, default: false, required: true })
    catalogDisplay!: boolean;
}

@Schema({ timestamps: true })
export class Design {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor || User })
    owner!: Types.ObjectId;

    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, maxLength: 1000, default: null })
    description?: string | null;

    @Prop({ type: [String], required: true })
    images!: [string];

    @Prop({ type: String, required: true, enum: DesignTypes })
    type!: string;

    @Prop({ type: () => [Specification], required: true })
    specifications?: [Specification];

    @Prop({ type: () => [ColorSnapshot] })
    colors?: [ColorSnapshot];

    @Prop({ type: Number, default: null })
    estimatedProductionDays?: number | null; 

    @Prop({ type: Number, default: null })
    estimatedDeliveryDays?: number | null; 

    @Prop({ type: Number })
    units!: number; 

    @Prop({ type: Number })
    amount?: number;

    @Prop({ type: Number })
    vat?: number;

    @Prop({ type: Number })
    percentageDiscount?: number;

    @Prop({ type: Boolean, default: false, required: true })
    catalogDisplay!: boolean;
}

export const DesignSchema = SchemaFactory.createForClass(Design);