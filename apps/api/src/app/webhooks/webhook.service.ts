import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionStatus } from '@pindder/contracts';
import { Subscription } from '../subscriptions/schemas/subscription.schema';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async handlePaystackEvent(event: unknown): Promise<void> {
    if (!event || typeof event !== 'object') return;

    const payload = event as {
      event?: string;
      data?: {
        customer?: { email?: string };
        subscription_code?: string;
        next_payment_date?: string;
      };
    };
    const data = payload.data;
    const email = data?.customer?.email;
    if (!email) return;

    switch (payload.event) {
      case 'subscription.create':
      case 'charge.success': {
        const update: Record<string, unknown> = {
          status: SubscriptionStatus.active,
          Provider: 'paystack',
        };
        if (data.subscription_code) {
          update['paystackSubscriptionCode'] = data.subscription_code;
        }
        if (data.next_payment_date) {
          const nextPaymentDate = new Date(data.next_payment_date);
          if (!Number.isNaN(nextPaymentDate.getTime())) {
            update['currentPeriodEndsAt'] = nextPaymentDate;
          }
        }
        await this.subscriptionModel.updateMany(
          { 'tailor.email': email, Provider: 'paystack' },
          { $set: update },
        );
        break;
      }
      case 'invoice.payment_failed':
        await this.subscriptionModel.updateMany(
          { 'tailor.email': email, Provider: 'paystack' },
          { $set: { status: SubscriptionStatus.past_due } },
        );
        break;
      case 'subscription.disable':
        await this.subscriptionModel.updateMany(
          { 'tailor.email': email, Provider: 'paystack' },
          { $set: { status: SubscriptionStatus.cancelled } },
        );
        break;
    }
  }
}
