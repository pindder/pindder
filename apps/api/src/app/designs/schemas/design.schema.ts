import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Client } from "../../clients/schemas/client.schema";
import { Brand } from "../../brands/schemas/brand.schema";

export type DesignDocument = HydratedDocument<Design>;

@Schema({ timestamps: true })
export class Design {
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => Client || Brand })
    owner!: [Client | Brand];

    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: [String], required: true })
    images?: [string];

    @Prop({ type: String, required: true, enum: ['READY_MADE', 'ON_DEMAND'] })
    type!: string;

    @Prop({ type: [String], enum: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'] })
    sizes?: [string];

    @Prop({ type: Number })
    productionDuration?: number; 

    @Prop({ type: Number, required: true })
    deliveryDuration?: number; 

    @Prop({ type: Number, required: true, default: 0 })
    units!: number; 

    @Prop({ type: String, enum: [] })
    visibility!: string; 

    @Prop({ type: Number })
    amount?: number;

    @Prop({ type: Number })
    vat?: number;

    @Prop({ type: Number })
    percentageDiscount?: number;
}

export const DesignSchema = SchemaFactory.createForClass(Design);