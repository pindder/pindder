import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Design } from "../../designs/schemas/design.schema";
import { Client } from "../../clients/schemas/client.schema";

export type MeasurementDocument = HydratedDocument<Measurement>;

@Schema({ timestamps: true })
export class Measurement {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    owner?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Design })
    design?: Design;

    @Prop({ type: String, enum: [] })
    measurementType!: string;
    
    @Prop({ type: Number })
    waist?: number;

    @Prop({ type: Number })
    neck?: number;

    @Prop({ type: Number })
    armLength?: Number;

    @Prop({ type: Number })
    trouserLength?: Number;

    @Prop({ type: Number })
    wrist?: number;

    @Prop({ type: Number })
    shoulder?: number;

    @Prop({ type: Number })
    chest?: number;

    @Prop({ type: Number })
    tigh?: number;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);