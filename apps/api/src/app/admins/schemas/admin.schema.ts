import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ type: String })
    fullname?: string;

    @Prop({ required: true })
    firstname!: string;
    
    @Prop({ required: true })
    lastname!: string;

    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    phoneNo!: string;

    @Prop({ required: true })
    role!: string;

    @Prop({ required: true, enum: [] })
    status!: string;

    @Prop({ type: String })
    country?: string;

    @Prop({ type: String })
    state?: string;

    @Prop({ type: String })
    postalCode?: string;

    @Prop({ required: true, minLength: 12, maxLength: 32 })
    password!: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);