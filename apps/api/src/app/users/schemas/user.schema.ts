
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatus, AccountTypes } from '@pindder/contracts';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from "crypto";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class UserSnapshot {
    @Prop({ type: String })
    _id!: string;
    
    @Prop({ type: String })
    firstname!: string;

    @Prop({ type: String })
    lastname!: string;

    @Prop({ type: String })
    username?: string;

    @Prop({ type: String })
    email!: string;

    @Prop({ type: String })
    countryCode!: string;

    @Prop({ type: String })
    tel!: string;

    @Prop({ type: String })
    gender!: string;

    @Prop({ type: String })
    accountType?: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, default: () => randomUUID()  })
  _id!: string;

  @Prop({ type: String, required: true })
  firstname!: string;

  @Prop({ type: String, required: true })
  lastname!: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  username!: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email!: string;

  @Prop({ type: String, required: true })
  countryCode!: string;
  
  @Prop({ type: String, required: true })
  tel!: string;

  @Prop({ type: String, required: true })
  gender!: string;

  @Prop({ type: String, enum: AccountTypes, required: true })
  accountType!: string;

  @Prop({ type: String, enum: AccountStatus, required: true })
  status!: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  referralCode?: string;
}



export const UserSchema = SchemaFactory.createForClass(User);
