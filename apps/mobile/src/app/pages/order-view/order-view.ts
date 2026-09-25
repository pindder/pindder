import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonButton, IonList, IonItem, IonIcon, IonItemSliding, IonAvatar, IonLabel, IonItemOptions, ViewWillEnter, IonHeader, IonButtons, IonListHeader, IonTitle, IonToolbar, IonContent, IonItemOption, ModalController, IonBackButton } from "@ionic/angular";
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IDesign, IOrderItem, IResponse } from '@pindder/contracts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-view',
  imports: [IonHeader, IonItemOptions, IonLabel, IonAvatar, IonItemSliding,
    IonIcon, IonItem, IonList, IonButton, IonButtons, IonListHeader,
    IonTitle, IonToolbar, IonContent, IonItemOption, IonBackButton],
  templateUrl: './order-view.html',
  styleUrl: './order-view.css',
})
export class OrderView implements ViewWillEnter, OnInit{
  private orderService = inject(OrderService);
  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);

  order!: IOrderItem | any;
  client_id!: string;

  ionViewWillEnter(): void {
    const client = this.ar.snapshot.paramMap.get('id');
    console.log(client);
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

  openMeasurementModal() {}

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  viewDesignDetails(design?: IDesign) {}

  cancelOrder() {}
}
