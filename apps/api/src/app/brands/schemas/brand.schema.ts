import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatus, AccountTypes } from '@pindder/contracts';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  brandName?: string;

  @Prop({ type: String, maxLength: 1000 })
  description?: string;

  @Prop({ required: true })
  adminFullname?: string;

  @Prop({ type: String })
  username?: string;

  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  phoneNo!: string;

  @Prop({ required: false })
  logoUri?: string;

  @Prop({ type: String })
  website?: string;

  @Prop({ type: String, required: true, enum: AccountStatus })
  status!: string;

  @Prop({ type: String, enum: AccountTypes, required: true })
  accountType!: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);