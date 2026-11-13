
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatus, AccountTypes } from '@pindder/contracts';
import { HydratedDocument } from 'mongoose';
// import { randomUUID } from "crypto";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstname!: string;

  @Prop({ type: String, required: true })
  lastname!: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  username!: string;

  @Prop({ type: String, required: true })
  email!: string;

  @Prop({ type: String, required: true })
  countryCode!: string;
  
  @Prop({ type: String, required: true })
  tel!: string;

  @Prop({ type: String, required: true })
  gender!: string;

  @Prop({ type: String, enum: AccountTypes, required: true })
  accountType!: string;

  @Prop({ type: String, enum: AccountStatus, default: AccountStatus.PENDING, required: true })
  status!: string;

  @Prop({ type: Boolean, default: false, required: true })
  verified!: boolean;

  @Prop({ type: String, required: true, unique: true, index: true })
  referralCode?: string;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
  { email: 1},
  { unique: true, 
    partialFilterExpression: { deletedAt: null }
  }
);