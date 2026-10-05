import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ColorDocument = HydratedDocument<Color>;

@Schema() 
export class ColorSnapshot {
  @Prop({ required: true })
  _id!: string;
  
  @Prop({ required: true })  
  name!: string;

  @Prop({ required: true })
  code!: string;

  @Prop({ required: false })
  rgb?: string;

  @Prop({ required: false })
  nameSlug?: string;  
  
  @Prop({ required: true })
  hex!: string;
}

@Schema({ _id: false })
export class Color {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  code!: string;

  @Prop({ type: String, required: false })
  rgb?: string;

  @Prop({ type: String, required: false })
  nameSlug?: string;

  @Prop({ type: String, required: true })
  hex!: string;
}

export const ColorSchema = SchemaFactory.createForClass(Color);