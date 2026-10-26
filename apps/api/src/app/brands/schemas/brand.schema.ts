import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatus } from '@pindder/contracts';
import { HydratedDocument } from 'mongoose';
import { TailorSnapshot } from '../../tailors/schemas/tailor.schema';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, maxLength: 1500 })
  description?: string;

  @Prop({ type: TailorSnapshot, required: true })
  admin!: TailorSnapshot;

  @Prop({ type: String, unique: true, required: true })
  email!: string;

  @Prop({ type: String, default: null })
  phoneNo!: string;

  @Prop({ type: String, default: null })
  logo?: string;

  @Prop({ type: String, default: null})
  website?: string;

  @Prop({ type: String, required: true, enum: AccountStatus, default: AccountStatus.ACTIVE })
  status!: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);