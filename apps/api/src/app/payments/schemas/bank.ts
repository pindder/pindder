import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type BankDocument = HydratedDocument<Bank>;

@Schema({ timestamps: true })
export class Bank extends Document {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, required: true })
    code!: string;
    
    @Prop({ type: Number, required: true })
    id!: number; 
}

export const BankSchema = SchemaFactory.createForClass(Bank);