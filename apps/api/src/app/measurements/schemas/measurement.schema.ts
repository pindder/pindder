import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Client } from "../../clients/schemas/client.schema";
import { MeasurementTypes } from "@pindder/contracts";
import { User } from "../../users/schemas/user.schema";

export type MeasurementDocument = HydratedDocument<Measurement>;

@Schema({ timestamps: true })
export class Measurement {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    client?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    user?: string;

    @Prop({ type: String, enum: MeasurementTypes, default: MeasurementTypes.CUSTOM })
    measurementType!: string;

    // @Prop({ type: String, enum: Sizes })
    // size?: string;

    @Prop({ type: Map, of: mongoose.Schema.Types.Mixed, default: {} })
    measurements?: Map<string, string>;

    @Prop({ type: String})
    notes?: string;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);