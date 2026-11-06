import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Tailor } from "../../tailors/schemas/tailor.schema";
import { User } from "../../users/schemas/user.schema";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { AccountTypes, TokenStatus, TokenTypes } from "@pindder/contracts";
import { Admin } from "../../admins/schemas/admin.schema";

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
    @Prop({ type: String, enum: TokenTypes, required: true })
    type!: string;

    @Prop({ type: String, unique: true, index: true })
    token!: string;

    @Prop({ type: String, enum: TokenStatus, default: TokenStatus.INVALIDATED })
    status!: string;

    @Prop({ type: String, enum: AccountTypes, required: true })
    accountType!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User || Tailor || Admin })
    account!: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);