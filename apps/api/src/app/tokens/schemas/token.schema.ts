import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import { Brand } from "../../brands/schemas/brand.schema";
import mongoose, { HydratedDocument } from "mongoose";
import { AccountTypes, TokenTypes } from "@pindder/contracts";

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
    @Prop({ type: String, enum: TokenTypes, required: true })
    type!: string;

    @Prop({ type: String, unique: true, index: true })
    token!: string;

    @Prop({ type: String, })
    status!: string;

    @Prop({ type: String, enum: AccountTypes, required: true })
    accountType!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    user!: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    tailor!: Tailor;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    brand!: Brand;
}

export const TokenSchema = SchemaFactory.createForClass(Token);