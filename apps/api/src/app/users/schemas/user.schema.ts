
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstname?: string;

  @Prop({ required: true })
  lastname?: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  username!: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email!: string;

  @Prop({ type: String, required: true })
  phoneNo!: string;

  @Prop({ type: String, required: true })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
