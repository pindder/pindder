import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  brandName?: string;

  @Prop({ required: true })
  adminFullname?: string;

  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  phoneNo!: string;

  @Prop({ required: false })
  logoUri?: string;

  @Prop({ required: true })
  password!: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);