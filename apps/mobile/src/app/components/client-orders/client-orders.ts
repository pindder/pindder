import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ViewWillEnter, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, ModalController } from '@ionic/angular';
import { DataTypes, IOrderItem, IResponse } from '@pindder/contracts';
import { ListCard } from '../list-card/list-card';
import { EmptyState } from '../empty-state/empty-state';
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-orders',
  imports: [IonIcon, ListCard, EmptyState, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon],
  templateUrl: './client-orders.html',
  styleUrl: './client-orders.css',
})
export class ClientOrders implements ViewWillEnter, OnInit{
  @Input() client_id!: string;
  @Output() action = new EventEmitter();
  
  private orderService = inject(OrderService);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  orders: any;
  dataTypes = DataTypes;

  ionViewWillEnter(): void {
    if(this.client_id) {
      this.fetchClientOrders();
    }
  }

  ngOnInit(): void {
    
  }

  dismissModal(newOrder?: boolean) {
    if(newOrder) {
      this.modalCtrl.dismiss(this.client_id, 'client');
    } else {
      this.modalCtrl.dismiss(null, 'cancel');
    }
  }

  fetchClientOrders() {
    this.orderService.searchOrders(this.client_id).subscribe({
      next: (res: IResponse<IOrderItem[]>) => {
        this.orders = res.data
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  viewOrder(order_id: string) {
    this.router.navigate(['/app/orders/' + order_id ]);
    this.dismissModal();
  }
}
