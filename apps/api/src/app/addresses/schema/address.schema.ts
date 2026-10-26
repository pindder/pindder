import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
    @Prop({ type: String, required: true })
    addressLine1!: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);