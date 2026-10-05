import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
//import { Measurement } from "../../measurements/schemas/measurement.schema";
import { DeliveryMethods, OrderStatus } from "@pindder/contracts";
import { Client, ClientSnapshot } from "../../clients/schemas/client.schema";
import { User, UserSnapshot } from "../../users/schemas/user.schema";
import { Tailor, TailorSnapshot } from "../../tailors/schemas/tailor.schema";
import { OrderStyleSnapshot } from "../../designs/schemas/design.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: String, required: true, unique: true, index: true })
    orderId!: string;

    @Prop({ type: ClientSnapshot, required: false })
    client?: Client;

    @Prop({ type: UserSnapshot, required: false })
    user?: User;

    @Prop({ type: TailorSnapshot, required: false })
    tailor?: Tailor;

    @Prop({ type: [OrderStyleSnapshot] })
    styles!: OrderStyleSnapshot[];

    @Prop({ type: mongoose.Schema.Types.Date, required: true })
    dueDate!: Date;

    @Prop({ type: String, required: true, enum: DeliveryMethods, default: DeliveryMethods.PICKUP })
    deliveryMethod!: string;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Measurement })
    // measurement?: Measurement;

    @Prop({ type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
    status!: string;

    @Prop({ type: Number })
    totalAmount!: number;

    @Prop({ type: Number })
    totalItems!: number;

    @Prop({ type: String })
    note?: string

    @Prop({ type: String })
    address?: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// 1. Keep standard Virtual definition
OrderSchema.virtual('quotes', {
    ref: 'Quote',
    localField: '_id',
    foreignField: 'order',
    justOne: false,
    // get: (quotes: any[]) => {
    //     if (!Array.isArray(quotes) || quotes.length === 0) return quotes;

    //     // Check if any quote has satisfiedParties === 2
    //     const satisfiedQuote = quotes.find((q) => q?.satisfiedParties === 2);

    //     // Return array with only the satisfied quote if found, else return all quotes
    //     return satisfiedQuote ? [satisfiedQuote] : quotes;
    // },
});

// 2. Enable virtuals in output
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

// 3. Keep Auto-Populate Pre-Hooks
function autoPopulateQuotes(this: any) {
    this.populate('quotes');
}

OrderSchema.pre('findOne', autoPopulateQuotes);
OrderSchema.pre('find', autoPopulateQuotes);

// 4. Helper method to apply conditional filtering logic on the quotes array
function filterQuotesCondition(doc: any) {
  if (doc && Array.isArray(doc.quotes) && doc.quotes.length > 0) {
    // Find if any quote has satisfiedParties equal to 2
    const satisfiedQuote = doc.quotes.find(
      (q: any) => q.satisfiedParties === 2,
    );

    if (satisfiedQuote) {
      // If a satisfied quote exists, return only that one in the quotes array
      doc.quotes = [satisfiedQuote];
    }
    // Otherwise, leave doc.quotes intact (returns all quotes)
  }
}

// 5. Post Hooks to filter populated results automatically
OrderSchema.post('findOne', function (doc) {
  filterQuotesCondition(doc);
});

OrderSchema.post('find', function (docs) {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => filterQuotesCondition(doc));
  }
});