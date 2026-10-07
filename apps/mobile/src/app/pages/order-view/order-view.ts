import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonList, IonItem, IonIcon, IonItemSliding, IonAvatar, 
  IonLabel, IonItemOptions, ViewWillEnter, IonHeader, IonButtons, IonListHeader, 
  IonTitle, IonToolbar, IonContent, IonItemOption, ModalController, IonBackButton, 
  IonNote, ToastController, IonModal 
} from "@ionic/angular";
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IDesign, IOrderItem, IOrderStyle, IResponse, OrderStatus } from '@pindder/contracts';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { Measurement } from '../../components/measurement/measurement';

@Component({
  selector: 'app-order-view',
  imports: [
    IonHeader, IonItemOptions, IonLabel, IonAvatar, IonItemSliding,
    IonIcon, IonItem, IonList, IonButton, IonButtons, IonListHeader,
    IonTitle, IonToolbar, IonContent, IonItemOption, IonBackButton,
    IonToolbar, IonContent, IonItemOption, IonBackButton, DatePipe, 
    IonNote, PrimaryButton, IonModal, IonNote
  ],
  templateUrl: './order-view.html',
  styleUrl: './order-view.css',
})
export class OrderView implements ViewWillEnter, OnInit{
  @Input() order!: IOrderItem | any;
  @Input() isPreview: boolean = false;
  @Output() action = new EventEmitter();

  private orderService = inject(OrderService);
  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  //order!: IOrderItem | any;
  client_id!: string;
  orderStatuses = OrderStatus;
  isModalOpen = false;

  selectedStyleIndex!: number;
  selectedStyle!: IOrderStyle;

  ionViewWillEnter(): void {
    const client = this.ar.snapshot.paramMap.get('id');
    
    if(client) {
      this.client_id = client;
      this.fetchOrder();
    }
  }

  ngOnInit(): void {
    
  }

  fetchOrder() {
    this.orderService.fetchOrder(this.client_id).subscribe({
      next: (res: IResponse<IOrderItem>) => {
        this.order = res.data;
        console.log(this.order);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  viewDesignDetails(design?: IDesign) {}

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
    console.log(this.selectedStyle);
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
}
