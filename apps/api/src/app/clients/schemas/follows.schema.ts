import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Brand } from "../../brands/schemas/brand.schema";

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    client!: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    tailor!: Brand;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);