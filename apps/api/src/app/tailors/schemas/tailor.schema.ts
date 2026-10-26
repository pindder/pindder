import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AccountStatus, AccountTypes } from "@pindder/contracts";
import { randomUUID } from "crypto";
import { HydratedDocument, Model } from "mongoose";

export type TailorDocument = HydratedDocument<Tailor>;

@Schema()
export class TailorSnapshot {
    @Prop({ type: String })
    _id!: string;

    @Prop({ type: String })
    fullname?: string;

    @Prop({ type: String })
    firstname?: string;

    @Prop({ type: String })
    lastname?: string;

    @Prop({ type: String })
    username!: string;

    @Prop({ type: String })
    email!: string;

    @Prop({ type: String })
    countryCode!: string;

    @Prop({ type: String })
    tel?: string;

    @Prop({ type: String })
    accountType!: string;

    @Prop({ type: String })
    profileImg?: string;
}

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Tailor {
    @Prop({ type: String, default: () => randomUUID() })
    _id!: string;

    @Prop({ type: String, maxLength: 1000 })
    description?: string;

    @Prop({ type: String, required: true })
    fullname!: string;

    @Prop({ type: String, required: false })
    firstname?: string;

    @Prop({ type: String, required: false })
    lastname?: string;

    @Prop({ type: String, required: true })
    username!: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    email!: string;

    @Prop({ type: String, required: true })
    countryCode!: string;

    @Prop({ type: String, required: true })
    tel?: string;

    @Prop({ type: String })
    catalog?: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    referralCode!: string;

    @Prop({ type: String, enum: AccountTypes, required: true })
    accountType!: string;

    @Prop({ type: String })
    profileImg?: string;

    @Prop({ type: String, required: true, enum: AccountStatus, default: AccountStatus.PENDING })
    status!: string;
}

export const TailorSchema = SchemaFactory.createForClass(Tailor);

// 1. Virtual definition for subscription assigned to this tailor
TailorSchema.virtual('subscription', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'tailor._id', // Uses 'tailor' if referencing ID string, or 'tailor._id' if embedded subdocument
    justOne: true
});

// 2. Pre-hook to auto-populate subscription
function autoPopulateSubscription(this: any) {
    this.populate({
        path: 'subscription',
        justOne: true
    });
}

TailorSchema.pre('findOne', autoPopulateSubscription);
TailorSchema.pre('find', autoPopulateSubscription);

// 3. Static method to aggregate metrics directly in MongoDB
TailorSchema.statics.getTailorWithStats = async function (tailorId: string) {
  const result = await this.aggregate([
    { $match: { _id: tailorId } },
    {
      $lookup: {
        from: 'orders', // Make sure this matches your MongoDB collection name for orders
        localField: '_id',
        foreignField: 'tailor._id', // Matches tailor._id embedded in order document
        as: 'orders'
      }
    },
    {
      $lookup: {
        from: 'subscriptions', // Database collection name for subscriptions (check exact name in Mongo)
        localField: '_id',
        foreignField: 'tailor._id', // Or 'tailor._id' depending on Subscription schema
        as: 'subscription',
      }
    },
    {
      $lookup: {
        from: 'clients', // Database collection name for subscriptions (check exact name in Mongo)
        localField: '_id',
        foreignField: 'referee._id', // Or 'tailor._id' depending on Subscription schema
        as: 'clients'
      }
    },
    {
      $lookup: {
        from: 'referrals', // Database collection name for subscriptions (check exact name in Mongo)
        localField: '_id',
        foreignField: 'referrer._id', // Or 'tailor._id' depending on Subscription schema
        as: 'referrals'
      }
    },
    {
      $addFields: {
        subscription: { $arrayElemAt: ['$subscription', 0] },
        metrics: {
            totalRevenue: { $sum: '$orders.totalAmount' },
            totalClients: { $size: '$clients' },
            totalOrders: { $size: '$orders' },
            totalReferrals: { $size: '$referrals' }
        }
      }
    },
    // {
    //   $project: {
    //     orders: 0 // Exclude raw orders array from payload
    //   }
    // }
  ]);

  return result[0] || null;
};

// 4. Static method to aggregate metrics for TailorSchema
TailorSchema.statics.getAllTailorsWithStats = async function (options?: {
  limit?: number;
  skip?: number;
  search?: string;
}) {
  const { limit = 20, skip = 0, search } = options || {};

  const pipeline: any[] = [];

  // Optional: Add search filter if searching by name/email
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { fullname: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    });
  }

  pipeline.push(
    // 1. Join orders collection for all matched tailors
    {
      $lookup: {
        from: 'orders', // MongoDB collection name for orders
        localField: '_id',
        foreignField: 'tailor._id', // Field in Order document
        as: 'orders'
      }
    },
    // 2. JOIN SUBSCRIPTIONS (This replaces Mongoose virtual populate for aggregations)
    {
      $lookup: {
        from: 'subscriptions', // Database collection name for subscriptions (check exact name in Mongo)
        localField: '_id',
        foreignField: 'tailor._id', // Or 'tailor._id' depending on Subscription schema
        as: 'subscription'
      }
    },
    // 3. 
    {
      $lookup: {
        from: 'clients', // Database collection name for subscriptions (check exact name in Mongo)
        localField: '_id',
        foreignField: 'referee._id', // Or 'tailor._id' depending on Subscription schema
        as: 'clients'
      }
    },
    // 4. 
    {
      $addFields: {
        subscription: { $arrayElemAt: ['$subscription', 0] },
        metrics: {
            totalRevenue: { $sum: '$orders.totalAmount' },
            totalClients: { $size: '$clients' },
            totalOrders: { $size: '$orders' }
        }
      }
    },
    // 5. Remove raw orders array from final output payload
    {
      $project: {
        orders: 0,
        clients: 0
      }
    },
    // 4. Pagination (crucial for performance)
    { $skip: skip },
    { $limit: limit }
  );

  return await this.aggregate(pipeline);
};

// 4. Custom Model Interface for NestJS Dependency Injection
export interface ITailorModel extends Model<TailorDocument> {
  getTailorWithStats(tailorId: string): Promise<any>;
  getAllTailorsWithStats(options?: { limit?: number; skip?: number; search?: string }): Promise<any[]>;
}