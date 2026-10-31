import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { TailorSnapshot } from '../../tailors/schemas/tailor.schema';
import { randomUUID } from 'crypto';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class ClientSnapshot {
    @Prop({ type: String })
    _id!: string;

    @Prop({ type: String })
    fullname!: string;

    @Prop({ type: String })
    firstname?: string;

    @Prop({ type: String })
    lastname?: string;

    @Prop({ type: String })
    email!: string;

    @Prop({ type: String })
    countryCode!: string;

    @Prop({ type: String })
    tel!: string;

    @Prop({ type: String })
    phoneNo!: string;

    @Prop({ type: String })
    gender!: string;
}

@Schema({ 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
})
export class Client {
    @Prop({ 
        type: String, 
        required: true, 
        default: () => randomUUID() 
    })
    _id!: string;

    @Prop({ type: String })
    fullname!: string;

    @Prop({ type: String, required: true })
    firstname?: string;

    @Prop({ type: String, required: true })
    lastname?: string;

    @Prop({ type: String, unique: true })
    email!: string;

    @Prop({ type: String })
    countryCode!: string;

    @Prop({ type: String })
    tel!: string;

    @Prop({ type: String, required: true })
    phoneNo!: string;

    @Prop({ type: () => TailorSnapshot, required: true })
    referee!: TailorSnapshot;

    @Prop({ type: String, required: true })
    gender!: string;

    @Prop({ type: String, ref: () => User })
    user?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

// 1. Virtual definition for subscription assigned to this tailor
ClientSchema.virtual('address', {
    ref: 'address',
    localField: '_id',
    foreignField: 'tailor._id', // Uses 'tailor' if referencing ID string, or 'tailor._id' if embedded subdocument
    justOne: true
});