import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ClientSnapshot } from "../../clients/schemas/client.schema";
import { MeasurementTypes } from "@pindder/contracts";
import { UserSnapshot } from "../../users/schemas/user.schema";
import { ColorSnapshot } from "../../colors/schema/color.schema";

export type MeasurementDocument = HydratedDocument<Measurement>;

@Schema({ _id: false })
export class MeasurementSnapshot {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: ClientSnapshot, required: false })
    client?: ClientSnapshot;

    @Prop({ type: UserSnapshot, required: false })
    user?: UserSnapshot;

    @Prop({ type: String, enum: MeasurementTypes, default: MeasurementTypes.CUSTOM })
    measurementType!: string;

    @Prop({ type: Map, of: mongoose.Schema.Types.Mixed, default: {} })
    measurements?: Map<string, string>;

    @Prop({ type: String})
    notes?: string;

    @Prop({ type: ColorSnapshot })
    color?: ColorSnapshot; 
}

@Schema({ timestamps: true })
export class Measurement {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: ClientSnapshot, required: false })
    client?: ClientSnapshot;

    @Prop({ type: UserSnapshot, required: false })
    user?: UserSnapshot;

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