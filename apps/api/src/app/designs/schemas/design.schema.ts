import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { DesignTypes, Sizes } from "@pindder/contracts";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";

export type DesignDocument = HydratedDocument<Design>;

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

    @Prop({ type: [String], enum: Sizes })
    sizes?: [string];

    @Prop({ type: [String], required: true })
    selectedSizes?: [string];

    @Prop({ type: [String] })
    colors?: [string];

    @Prop({ type: [String ]})
    selectedColors?: [string];

    @Prop({ type: Date })
    dueDate!: Date; 

    @Prop({ type: Number })
    amount!: number;

    @Prop({ type: Number })
    quantity!: number;

    @Prop({ type: String })
    note?: string;

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

    @Prop({ type: [String], enum: Sizes, required: true })
    sizes?: [string];

    @Prop({ type: [String] })
    colors?: [string];

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