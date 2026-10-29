import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Model } from "mongoose";

export type PlanDocument = HydratedDocument<Plan>;

@Schema({ 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Plan {
    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, required: true })
    interval!: string;

    @Prop({ type: [String], required: true })
    features!: string[];

    @Prop({ type: Number, required: true })
    amount!: number;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: Number })
    integration!: number;
    
    @Prop({ type: String })
    domain!: string;

    @Prop({ type: String })
    plan_code!: string;

    @Prop({ type: Boolean, default: true })
    send_invoices!: boolean;
    
    @Prop({ type: Boolean, default: true })
    send_sms!: boolean;
    
    @Prop({ type: Boolean, default: false })
    hosted_page!: boolean;
    
    @Prop({ type: String, default: 'NGN' })
    currency?: string;
    
    @Prop({ type: Number })
    plan_id!: number;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    metadata?: any;

    @Prop({ type: Boolean, default: false })
    free!: boolean

    @Prop({ type: Boolean, default: false })
    recommended!: boolean;
}

@Schema({ timestamps: true })
export class PlanSnapshot extends Plan { }

export const PlanSchema = SchemaFactory.createForClass(Plan);

PlanSchema.statics.getPlansWithStatistics = async function (options?: {
    limit?: number,
    skip?: number,
    search?: string
}) {
    const { limit = 20, skip = 0, search } = options || {};

    const pipeline: any[] = [];

    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                ]
            }
        });
    }

    pipeline.push(
        {
            $lookup: {
                from: 'subscriptions', // MongoDB collection name for subscriptions
                localField: '_id',
                foreignField: 'plan._id', // Field in Subscription document
                as: 'subscribers'
            }
        },
        {
            $addFields: {
                totalSubscribers: { $size: '$subscribers' },
            }
        },
        { $skip: skip },
        { $limit: limit }
    );

    return await this.aggregate(pipeline);
}

// Custom Model Interface for NestJS Dependency Injection
export interface IPlanModel extends Model<PlanDocument> {
  getPlansWithStatistics(options?: { limit?: number; skip?: number; search?: string }): Promise<any[]>;
}