import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatus } from '@pindder/contracts';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Tailor } from '../../tailors/schemas/tailor.schema';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ type: String, required: true, unique: true })
  name!: string;

  @Prop({ type: String, maxLength: 1800, default: null})
  bio?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
  admin!: Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  email!: string;

  @Prop({ type: String, default: null })
  countryCode?: string;

  @Prop({ type: String, default: null })
  tel?: string;
  
  @Prop({ type: String, default: null })
  country?: string;

  @Prop({ type: String, default: null })
  state?: string;

  @Prop({ type: String, default: null })
  region?: string;

  @Prop({ type: String, default: null })
  logo?: string;

  @Prop({ type: String, default: null})
  website?: string;

  @Prop({ type: String, required: true, enum: AccountStatus, default: AccountStatus.ACTIVE })
  status!: string;
}

export class BrandSnapshot extends Brand { };

export const BrandSchema = SchemaFactory.createForClass(Brand);