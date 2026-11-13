import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IProfile } from '@pindder/contracts';
import { IonIcon, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular';
import { IonText } from "@ionic/angular";
import {
  CreatePaymentSheetOption,
  PaymentFlowEventsEnum,
  PaymentSheetEventsEnum,
  Stripe,
} from '@capacitor-community/stripe';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-earnings-card',
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonIcon, IonButton],
  templateUrl: './earnings-card.html',
  styleUrl: './earnings-card.css',
})
export class EarningsCard implements OnInit{
  @Input() profile!: IProfile;
  @Output() withdraw = new EventEmitter();
  @Output() earn = new EventEmitter();

  private appService = inject(AppService);

  readonly processSheet = signal<'willReady' | 'Ready'>('willReady');
  readonly processFlow = signal<'willReady' | 'Ready' | 'canConfirm'>('willReady');

  async ngOnInit() {
    Stripe.addListener(PaymentSheetEventsEnum.Loaded, () => {
      this.processSheet.set('Ready');
      console.log('PaymentSheetEventsEnum.Loaded');
    });

    Stripe.addListener(PaymentSheetEventsEnum.FailedToLoad, () => {
      console.log('PaymentSheetEventsEnum.FailedToLoad');
    });

    Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
      this.processSheet.set('willReady');
      console.log('PaymentSheetEventsEnum.Completed');
    });

    Stripe.addListener(PaymentSheetEventsEnum.Canceled, () => {
      this.processSheet.set('willReady');
      console.log('PaymentSheetEventsEnum.Canceled');
    });

    Stripe.addListener(PaymentSheetEventsEnum.Failed, () => {
      this.processSheet.set('willReady');
      console.log('PaymentSheetEventsEnum.Failed');
    });

    /** ------------------------------------------------------------------- **/

    Stripe.addListener(PaymentFlowEventsEnum.Loaded, () => {
      this.processFlow.set('Ready');
      console.log('PaymentFlowEventsEnum.Loaded');
    });

    Stripe.addListener(PaymentFlowEventsEnum.FailedToLoad, () => {
      console.log('PaymentFlowEventsEnum.FailedToLoad');
    });

    Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
      this.processFlow.set('willReady');
      console.log('PaymentFlowEventsEnum.Completed');
    });

    Stripe.addListener(PaymentFlowEventsEnum.Canceled, () => {
      this.processFlow.set('willReady');
      console.log('PaymentFlowEventsEnum.Canceled');
    });

    Stripe.addListener(PaymentFlowEventsEnum.Failed, () => {
      this.processFlow.set('willReady');
      console.log('PaymentFlowEventsEnum.Failed');
    });

    Stripe.addListener(PaymentFlowEventsEnum.Created, (info) => {
      console.log(info);
      this.processFlow.set('canConfirm');
    });
  }

  async createPaymentSheet(withCustomer = true, withBillingDetails = false) {
    if (withCustomer) {
      const { paymentIntent, ephemeralKey, customer } = await this.appService.stripeCheckout();

      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        merchantDisplayName: 'rdlabo',
        billingDetailsCollectionConfiguration: {
          email: 'always',
          name: 'always',
          phone: 'always',
          address: 'full',
        },
        defaultBillingDetails: {
          email: 'info@example.com',
          name: 'Masahiko Sakakibara',
          phone: '+15551234567',
          address: {
            city: 'San Francisco',
            country: 'US',
            line1: '123 Market St',
            line2: '',
            postalCode: '94107',
            state: 'CA',
          },
        },
      });
    } else {
      const { paymentIntent } = await this.appService.stripeCheckout();

      const base: CreatePaymentSheetOption = {
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'rdlabo',
      };

      if (withBillingDetails) {
        Object.assign(base, {
          billingDetailsCollectionConfiguration: {
            email: 'always',
            name: 'always',
            phone: 'always',
            address: 'full',
          },
        });
      }

      await Stripe.createPaymentSheet(base);
    }
    this.presentPaymentSheet();
  }

  async createPaymentSheetWithSetupIntent() {
    const { setupIntent, ephemeralKey, customer } = await this.appService.stripeCheckout();

    await Stripe.createPaymentSheet({
      setupIntentClientSecret: setupIntent,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
      merchantDisplayName: 'rdlabo',
      enableGooglePay: true,
      GooglePayIsTesting: true,
    });
  }

  presentPaymentSheet() {
    return Stripe.presentPaymentSheet();
  }

  async createPaymentFlow(withCustomer = true) {
    if (withCustomer) {
      const { paymentIntent, ephemeralKey, customer } = await this.appService.stripeCheckout();

      await Stripe.createPaymentFlow({
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        merchantDisplayName: 'rdlabo',
      });
    } else {
      const { paymentIntent } = await this.appService.stripeCheckout();

      await Stripe.createPaymentFlow({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'rdlabo',
      });
    }
  }

  presentPaymentFlow() {
    return Stripe.presentPaymentFlow();
  }

  confirmPaymentFlow() {
    return Stripe.confirmPaymentFlow();
  }
}
