import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { randomUUID } from "crypto";
import { ClientSnapshot } from "../../clients/schemas/client.schema";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { UserSnapshot } from "../../users/schemas/user.schema";
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

    @Prop({ type: ClientSnapshot })
    client?: ClientSnapshot;

    @Prop({ type: TailorSnapshot })
    tailor?: TailorSnapshot;

    @Prop({ type: UserSnapshot })
    customer?: UserSnapshot;

    @Prop({ type: String, required: true })
    title!: string;
    
    @Prop({ type: String, required: true })
    message!: string;

    @Prop({ type: String, required: true, enum: NotificationStatus, default: NotificationStatus.UNREAD })
    status!: string;

    @Prop({ type: String })
    icon?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
