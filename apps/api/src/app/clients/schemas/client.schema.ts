import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Tailor } from '../../tailors/schemas/tailor.schema';
// import { randomUUID } from 'crypto';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
})
export class Client {
    @Prop({ type: String })
    fullname!: string;

    @Prop({ type: String, required: true })
    firstname?: string;

    @Prop({ type: String, required: true })
    lastname?: string;

    @Prop({ type: String })
    email!: string;

    @Prop({ type: String })
    countryCode!: string;

    @Prop({ type: String })
    tel!: string;

    @Prop({ type: String, required: true })
    phoneNo!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Tailor })
    referee!: Types.ObjectId;

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