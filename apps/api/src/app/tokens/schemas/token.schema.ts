import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { UserSnapshot } from "../../users/schemas/user.schema";
import { HydratedDocument } from "mongoose";
import { AccountTypes, TokenStatus, TokenTypes } from "@pindder/contracts";
import { AdminSnapshot } from "../../admins/schemas/admin.schema";

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

    @Prop({ type: () => UserSnapshot || TailorSnapshot || AdminSnapshot })
    account!: UserSnapshot | TailorSnapshot | AdminSnapshot;
}

export const TokenSchema = SchemaFactory.createForClass(Token);