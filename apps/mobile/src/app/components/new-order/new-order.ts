import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonList, ViewWillEnter, IonLabel, ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonListHeader, ModalController, IonThumbnail, IonDatetime } from "@ionic/angular";
import { IClient, IDesign, IOrder } from '@pindder/contracts';
import { OrderStatus } from '@pindder/contracts';
import { NewClient } from '../new-client/new-client';
import { ClientSelection } from '../client-selection/client-selection';
import { NewDesign } from '../new-design/new-design';
import { DesignSelection } from '../design-selection/design-selection';

@Component({
  selector: 'app-new-order',
  imports: [
    IonDatetime,
    IonLabel, IonContent,
    IonList, IonItem, IonButton, FormsModule,
    IonHeader, IonToolbar,
    IonButtons, IonIcon, IonTitle,
    IonListHeader, IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonThumbnail,
    FormsModule
],
  templateUrl: './new-order.html',
  styleUrl: './new-order.css',
})
export class NewOrder implements ViewWillEnter, OnInit{
  @Input() client?: IClient;
  @Input() design?: IDesign;

  private cdr = inject(ChangeDetectorRef);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  presentingElement!: HTMLElement | null;
  selectedClient!: any;
  selectedDesign!: any;

  order: IOrder = {
    amount: 0,
    deliveryDate: '',
    status: OrderStatus.PENDING,
    units: 0,
    productId: '',
    size: '',
    style: '',
    client: ''
  };
  clients: IClient[] = [];
  designs: IDesign[] = [];

  ionViewWillEnter(): void {
    // console.log(this.client);
    // console.log(this.design);
    if(this.client) {
      this.selectedClient = this.client;
    } else if(this.design) {
      this.selectedDesign = this.design;
    }
    this.cdr.markForCheck();
  }

  async openNewClientModal() {
    const modal = await this.modalCtrl.create({
      component: NewClient, // Standalone modal component for searching clients
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      this.selectedClient = data;
      console.log('Selected client for order:', this.selectedClient);
    }
  }

  async openSelectClientModal() {
    const modal = await this.modalCtrl.create({
      component: ClientSelection, // Standalone modal component for searching clients
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      this.selectedClient = data;
      console.log('Selected client for order:', this.selectedClient);
    }
    this.cdr.markForCheck();
  }

  async openNewDesignModal() { 
    const modal = await this.modalCtrl.create({
      component: NewDesign, // Standalone modal component for searching clients
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      this.selectedDesign = data;
      console.log('Selected client for order:', this.selectedClient);
    }
  }

  async openSelectDesignModal() { 
    const modal = await this.modalCtrl.create({
      component: DesignSelection, // Standalone modal component for searching clients
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      this.selectedDesign = data;
      console.log('Selected client for order:', this.selectedClient);
    }

    this.cdr.markForCheck();
  }

  ngOnInit() {
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  removeSelectedClient() {
    this.selectedClient = undefined;
  }

  removeSelectedDesign() {
    this.selectedDesign = undefined;
  }

  presentToast() {
    this.toastCtrl.create({
      color: 'primary',
      animated: true,
      duration: 4000,
      position: 'top'
    });
  }

  submit() {}
}
