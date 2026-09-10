import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from '../../brands/schemas/brand.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ timestamps: true })
export class Client {
    @Prop({ type: String })
    fullname!: string;

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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Brand })
    referee?: string;

    @Prop({ type: String, required: true })
    password?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);