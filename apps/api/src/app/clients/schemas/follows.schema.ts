import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Brand } from "../../brands/schemas/brand.schema";
import { Client } from "./client.schema";
import { Tailor } from "../../tailors/schemas/tailor.schema";

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
    @Prop({ type: String, ref: () => User })
    user?: string;

    @Prop({ type: String, ref: () => Client })
    client?: string;

    @Prop({ type: String, ref: () => Tailor })
    tailor?: string;

    @Prop({ type: String, ref: () => Brand })
    brand?: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);