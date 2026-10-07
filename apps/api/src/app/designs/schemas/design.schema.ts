import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { DesignTypes } from "@pindder/contracts";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { ColorSnapshot } from "../../colors/schema/color.schema";

export type DesignDocument = HydratedDocument<Design>;

@Schema({ _id: false })
export class SpecificationSnapshot {
    @Prop({ type: String, required: true })
    size!: string;

    @Prop({ type: Number, required: true, default: 1 })
    quantity!: number;

    @Prop({ type: [ColorSnapshot], required: true })
    colors?: ColorSnapshot[];

    @Prop({ type: [ColorSnapshot] })
    selectedColors?: ColorSnapshot[];

    @Prop({ type: Number, required: true })
    inStock!: number;

    @Prop({ type: Number, required: true })
    amount!: number;
}

@Schema({ _id: false })
export class Specification {
    @Prop({ type: String, required: false })
    size!: string;

    @Prop({ type: String, required: false})
    description?: string;

    @Prop({ type: [ColorSnapshot] })
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

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: [String], required: true })
    images!: [string];

    @Prop({ type: String, required: true, enum: DesignTypes })
    type!: string;

    @Prop({ type: [Specification] })
    specifications?: [Specification];

    @Prop({ type: [SpecificationSnapshot] })
    selections?: SpecificationSnapshot[];

    @Prop({ type: Date })
    dueDate!: Date; 

    @Prop({ type: Number })
    amount!: number;

    @Prop({ type: Number })
    quantity!: number;

    @Prop({ type: ColorSnapshot })
    selectedColors?: ColorSnapshot[]

    @Prop({ type: ColorSnapshot })
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
    @Prop({ type: String, ref: () => User || Tailor })
    owner!: string;

    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: [String], required: true })
    images!: [string];

    @Prop({ type: String, required: true, enum: DesignTypes })
    type!: string;

    @Prop({ type: [Specification], required: true })
    specifications?: [Specification];

    @Prop({ type: [ColorSnapshot] })
    colors?: [ColorSnapshot];

    @Prop({ type: Number })
    productionDuration?: number; 

    @Prop({ type: Number })
    deliveryDuration?: number; 

    @Prop({ type: Number })
    units!: number; 

    @Prop({ type: String, enum: [] })
    visibility!: string; 

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