import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTypes, DesignTypes, IDesign, IOrderItem, IOrderStyle, IOrderWithPayment, IPayment, IResponse, OrderStatus, PaymentMethods } from '@pindder/contracts';
import { Preview } from '@pindder/shared-ui';
import { AppService } from '../../services/app.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { OrderService } from '../../services/order.service';
import { Share } from '@capacitor/share';
import {
  CreatePaymentSheetOption,
  PaymentFlowEventsEnum,
  PaymentSheetEventsEnum,
  Stripe,
} from '@capacitor-community/stripe';

@Component({
  selector: 'app-view-order',
  imports: [Preview],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css',
})
export class ViewOrder implements OnInit {
  order!: IOrderItem;
  @Input() isPreview = false;
  @Output() action = new EventEmitter();

  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private appService = inject(AppService);
  private router = inject(Router);
  private ar = inject(ActivatedRoute);

  //order!: IOrderItem | any;
  client_id!: string;
  orderStatuses = OrderStatus;
  orderStatus = Object.keys(OrderStatus);
  isModalOpen = false;

  payment!: IPayment[];
  selectedStyleIndex!: number;
  selectedStyle!: IOrderStyle;

  designTypes = DesignTypes;
  paymentMethod = PaymentMethods;

  isSharingSupported = signal<boolean>(false);

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

    try {
      // Check if the current platform/browser supports sharing
      const result = await Share.canShare();
      this.isSharingSupported.set(result.value);
    } catch (error) {
      console.error('Error checking share capability:', error);
      this.isSharingSupported.set(false);
    }
  }

  async createPaymentSheet(withCustomer = true, withBillingDetails = false) {
    if(!this.order) {
      return console.log('No order');
    }

    if (withCustomer) {
      const { paymentIntent, ephemeralKey, customer } = await this.appService.stripeCheckout({ amount: this.order.totalAmount });

      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        merchantDisplayName: 'Pindder',
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

      await this.presentPaymentSheet();
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

  async presentPaymentSheet() {
    try {
      const result = await Stripe.presentPaymentSheet();
      
      // Payment completed successfully!
      console.log('Payment success:', result);
      return { success: true, result };
      
    } catch (error: any) {
      // Handle user cancellation or payment failures gracefully
      if (error.code === 'Canceled' || error.message?.includes('Canceled')) {
        console.log('User canceled the payment sheet.');
        return { success: false, reason: 'canceled' };
      }
      
      console.error('Payment sheet failed:', error);
      throw error;
    }
  }

  ionViewWillEnter(): void {
    this.client_id = this.ar.snapshot.paramMap.get('id')!;
    this.fetchOrder();
  }


  fetchOrder() {
    this.orderService.fetchOrder(this.client_id).subscribe({
      next: (res: IResponse<IOrderWithPayment>) => {
        if(res.data?.order) this.order = res.data?.order;
        if(res.data?.payment) {
          this.payment = res.data?.payment;
        }
        // console.log(this.order);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  async sharePaymentLink(payment_link?: string) {
    if (!this.isSharingSupported()) return;

    try {
      await Share.share({
        title: 'Pindder: Order Payment!',
        text: 'Hey, kindly complete your payment through the link.',
        url: `${payment_link ?? this.payment[0].responsePayload.authorization_url}`, // The link you want to share
        dialogTitle: 'Pindder payment', // Android only title for the popup
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  viewDesignDetails(design?: IDesign) {
    return;
  }

  viewPaymentLink() {
    if(this.payment.length > 0) {
      console.log(this.payment);
    } else if(this.payment.length == 0) {
      const payment: IPayment = {
        callbackUrl: `http://localhost:4000/app/orders/${this.order._id}`,
        orderId: this.order._id
      };
      this.appService.generatePaymentLink(payment).subscribe({
        next: (response: IResponse<any>) => {
          this.payment[0] = response.data
          this.sharePaymentLink(response.data.responsePayload.authorization_url)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      }) 
    }
  }

  async copyPaymentLinkToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.payment[0].responsePayload.authorization_url);
      await this.showToast('Payment link copied to clipboard!');
    } catch (err) {
      await this.showToast('Failed to copy link. Please copy manually.');
      console.log(err);
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  async presentDeleteAlert() {
    const alert = await this.alertCtrl.create({
      header: `Delete Order`,
      message: `Are you sure you want to delete this ${DataTypes.ORDER}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.cancelOrder();
          }
        }
      ]
    });

    await alert.present();
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.order._id).subscribe({
      next: (res) => {
        this.presentToast(res.msg, 'danger', 'top');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  async openMeasurementModal() {
    return;
    // const modal = await this.modalCtrl.create({
    //   component: Measurement,
    //   componentProps: {
    //     client_id: this.order.client._id,
    //     client_gender: this.order.client.gender
    //   }
    // });

    // await modal.present();
  }

  async viewStyleDetail(style: IOrderStyle) {
    this.selectedStyle = style;
    //console.log(this.selectedStyle);
    this.isModalOpen = true;
  }
  
  // Ensures checkmark icon is readable on light vs dark colors
  getContrastColor(hex: string): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180 ? '#000000' : '#FFFFFF';
  }

  updateOrderStatus() {
    this.orderService.updateOrderStatus(this.order._id, this.order.status).subscribe({
      next: (response: IResponse<any>) => {
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  repeatOrder() {
    this.router.navigate(['app/orders'], {
      queryParams: {
        order: this.order._id 
      }
    });
  }
}
