import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { AccountStatus, AccountTypes, AdminRoles } from '@pindder/contracts';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ })
export class AdminSnapshot{
    @Prop({ type: String })
    fullname?: string;

    @Prop({ type: String })
    firstname?: string;

    @Prop({ type: String })
    lastname?: string;

    @Prop({ type: String })
    email?: string;

    @Prop({ type: String })
    countryCode?: string;

    @Prop({ type: String })
    tel?: string;

    @Prop({ type: [String] })
    roles?: string[];

    @Prop({ type: String })
    status?: string;
}

@Schema({ timestamps: true })
export class Admin {
    @Prop({ type: String })
    fullname?: string;

    @Prop({ type: String, required: true })
    firstname!: string;
    
    @Prop({ type: String, required: true })
    lastname!: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    email!: string;

    @Prop({ type: String, default: null })
    countryCode?: string;

    @Prop({ type: String, default: null })
    tel?: string;

    @Prop({ type: String, required: true, default: AccountTypes.ADMIN })
    accountType!: string;

    @Prop({ type: String })
    formattedPhoneNo?: string;

    @Prop({ type: [String], required: true, enum: AdminRoles })
    roles!: string[];

    @Prop({ type: String, required: true, enum: AccountStatus, default: AccountStatus.PENDING })
    status!: string;

    @Prop({ type: String, default: null })
    country?: string;

    @Prop({ type: String, default: null })
    state?: string;

    @Prop({ type: String, default: null })
    postalCode?: string;

    @Prop({ type: String, default: null })
    profileImg?: string;

    @Prop({ type: String, required: true })
    password!: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);