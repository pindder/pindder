import { Component, inject } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, 
  IonBackButton, IonSegmentButton, IonSegment, IonLabel, IonSegmentView,
  IonSegmentContent, 
  ViewWillEnter
} from "@ionic/angular";
import { EmptyState } from "../../components/empty-state/empty-state";
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  imports: [
    IonSegment,
    IonSegmentView,
    IonSegmentContent,
    IonSegmentButton,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonBackButton,
    IonLabel,
    EmptyState
],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements ViewWillEnter{
  private orderService = inject(OrderService);

  ionViewWillEnter(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.fetchOrders().subscribe((val) => {
      console.log(val);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
