import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IonButton, IonList, IonItem, IonIcon, IonItemSliding, IonAvatar, IonLabel, 
  IonItemOptions, ViewWillEnter, IonHeader, IonButtons, IonListHeader, IonTitle, 
  IonToolbar, IonContent, IonItemOption, ModalController, IonBackButton, IonNote, 
  ToastController, IonModal, IonItemGroup, IonItemDivider, AlertController, IonSelect, 
  IonSelectOption 
} from "@ionic/angular";
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTypes, DesignTypes, IDesign, IOrderItem, IOrderStyle, IOrderWithPayment, IPayment, IResponse, OrderStatus, PaymentMethods } from '@pindder/contracts';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { Measurement } from '../../components/measurement/measurement';
import { AppService } from '../../services/app.service';
import { FormsModule } from '@angular/forms';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-order-view',
  imports: [
    IonHeader, IonItemOptions, IonLabel, IonAvatar, IonItemSliding,
    IonIcon, IonItem, IonList, IonButton, IonButtons, IonListHeader,
    IonTitle, IonToolbar, IonContent, IonItemOption, IonBackButton,
    IonToolbar, IonContent, IonItemOption, IonBackButton, DatePipe,
    IonNote, PrimaryButton, IonModal, IonNote,
    IonItemGroup, TitleCasePipe, FormsModule,
    IonItemDivider, IonSelect, IonSelectOption
],
  templateUrl: './order-view.html',
  styleUrl: './order-view.css',
})
export class OrderView implements ViewWillEnter, OnInit{
  @Input() order!: IOrderItem | any;
  @Input() isPreview = false;
  @Output() action = new EventEmitter();

  private orderService = inject(OrderService);
  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private appService = inject(AppService);

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

  customModalOptions = {
    header: 'Update Status',
    breakpoints: [0, 0.5],
    initialBreakpoint: 0.5,
  };

  isSharingSupported = signal<boolean>(false);

  ionViewWillEnter(): void {
    console.log(this.order);
    const client = this.ar.snapshot.paramMap.get('id');
    
    if(client) {
      this.client_id = client;
      this.fetchOrder();
    }
  }

  async ngOnInit() {
    try {
      // Check if the current platform/browser supports sharing
      const result = await Share.canShare();
      this.isSharingSupported.set(result.value);
    } catch (error) {
      console.error('Error checking share capability:', error);
      this.isSharingSupported.set(false);
    }
  }

  fetchOrder() {
    this.orderService.fetchOrder(this.client_id).subscribe({
      next: (res: IResponse<IOrderWithPayment>) => {
        this.order = res.data?.order;
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
    const modal = await this.modalCtrl.create({
      component: Measurement,
      componentProps: {
        client_id: this.order.client._id,
        client_gender: this.order.client.gender
      }
    });

    await modal.present();
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
    this.orderService.updateOrderStatus(this.order).subscribe({
      next: (response: IResponse<any>) => {
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
}
