import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { randomUUID } from "crypto";
import { Client } from "../../clients/schemas/client.schema";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { DataTypes, NotificationActions, NotificationStatus } from "@pindder/contracts";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: String, default: () => randomUUID() })
    _id!: string;
    
    @Prop({ type: String, enum: DataTypes, required: true })
    type!: string;

    @Prop({ type: String, required: true, enum: NotificationActions })
    action!: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    data: any;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client || Tailor || User })
    initiator!: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client || Tailor || User })
    dependent?: Types.ObjectId | null;

    @Prop({ type: String, required: true })
    title!: string;
    
    @Prop({ type: String, required: true })
    message!: string;

    @Prop({ type: String, required: true, enum: NotificationStatus, default: NotificationStatus.UNREAD })
    status!: string;

    @Prop({ type: Boolean, required: true, default: false })
    read!: boolean;

    @Prop({ type: String })
    icon?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
