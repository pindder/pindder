import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: [String], required: true })
    featureList!: [string]; 

    @Prop({ })
    amount!: string;

    @Prop({ type: String, required: true })
    status!: string;

    /** What account types are eligible to see this plan */
    @Prop({ type: [String], required: true })
    availability!: [string];

    @Prop({ type: String })
    duration!: string;

    @Prop({ type: [String] })
    regions?: [string];
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);