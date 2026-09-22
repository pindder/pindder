import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, 
  IonBackButton, IonSegmentButton, IonSegment, IonLabel, IonSegmentView,
  IonSegmentContent, 
  ViewWillEnter,
  IonModal,
  ModalController,
} from "@ionic/angular";
import { EmptyState } from "../../components/empty-state/empty-state";
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataTypes, IClient, IDesign } from '@pindder/contracts';
import { NewOrder } from '../../components/new-order/new-order';
import { ClientService } from '../../services/client.service';
import { DesignService } from '../../services/design.service';

@Component({
  selector: 'app-orders',
  imports: [
    IonModal,
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
    EmptyState, NewOrder],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements ViewWillEnter, OnInit{
  @ViewChild('modal') modal!: IonModal;

  private orderService = inject(OrderService);
  private clientService = inject(ClientService);
  private designService = inject(DesignService);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);

  private ar = inject(ActivatedRoute);
  presentingElement!: HTMLElement | null;
  client_id = signal<string>("");
  design_id = signal<string>("");
  client!: IClient;
  design!: IDesign;
  dataTypes = DataTypes;

  ionViewWillEnter(): void {
    this.presentingElement = document.querySelector('.ion-page');
    const client_id = this.ar.snapshot.queryParamMap.get('client');
    const design_id = this.ar.snapshot.queryParamMap.get('style');

    if(client_id) {
      this.client_id.set(client_id);
      this.fetchClient(client_id);
    } else if(design_id) { 
      this.design_id.set(design_id);
      this.fetchDesign(design_id);
    } else {
      this.fetchOrders();
    }
  }

  ngOnInit(): void {

  }

  fetchOrders() {
    this.orderService.fetchOrders().subscribe((val) => {
      console.log(val);
      this.cdr.markForCheck();
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  fetchClient(client_id: string) {
    this.clientService.fetchClient(client_id).subscribe({
      next: (data) => {
        this.client = data.client;
        this.openNewOrderModal();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  fetchDesign(design_id: string) {
    this.designService.fetchDesign(design_id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.design = res.data;
        this.openNewOrderModal();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  async openNewOrderModal() {
    const modal = await this.modalCtrl.create({
      component: NewOrder,
      componentProps: {
        client: this.client,
        design: this.design
      }
    });

    await modal.present();

    // Optionally listen for returned data when the modal is dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected') {
      console.log('Returned data:', data);
    }
  }
}
