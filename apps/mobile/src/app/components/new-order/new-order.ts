import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonList, ViewWillEnter, 
  IonLabel, ToastController, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonIcon, IonListHeader, ModalController, IonThumbnail, 
  IonDatetime, IonDatetimeButton, IonModal,IonActionSheet  
} from "@ionic/angular";
import { DataTypes, IClient, IDesign, IOrder } from '@pindder/contracts';
import { OrderStatus } from '@pindder/contracts';
import { NewClient } from '../new-client/new-client';
import { ClientSelection } from '../client-selection/client-selection';
import { NewDesign } from '../new-design/new-design';
import { DesignSelection } from '../design-selection/design-selection';
import { ActivatedRoute, Router } from '@angular/router';
import { EmptyState } from '../empty-state/empty-state';
import { CreateOrderButton } from '../create-order-button/create-order-button';

@Component({
  selector: 'app-new-order',
  imports: [IonActionSheet, IonDatetimeButton, IonModal,
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
    FormsModule, EmptyState, CreateOrderButton],
  templateUrl: './new-order.html',
  styleUrl: './new-order.css',
})
export class NewOrder implements ViewWillEnter, OnInit, OnDestroy{
  @Input() client?: IClient;
  @Input() design?: IDesign;

  private cdr = inject(ChangeDetectorRef);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private ar = inject(ActivatedRoute);

  presentingElement!: HTMLElement | null;
  selectedClient!: any;
  selectedDesign!: any;
  selectedDate!: any;

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

  isClientActionSheetOpen = signal<boolean>(false);
  isDesignActionSheetOpen = signal<boolean>(false);

  /** Client Action Sheet Buttons */
  clientActionSheetButtons = [
    {
      text: 'New Client',
      icon: 'add-outline',
      handler: () => {
        this.openNewClientModal();
      },
    },
    {
      text: 'Existing Client',
      icon: 'search-outline',
      handler: () => {
        this.openSelectClientModal();
      },
    },
  ];

  /** Design Action Sheet Buttons */
  designActionSheetButtons = [
    {
      text: 'New Style',
      icon: 'add-outline',
      handler: () => {
        this.openNewDesignModal();
      },
    },
    {
      text: 'Existing Style',
      icon: 'search-outline',
      handler: () => {
        this.openSelectDesignModal();
      },
    },
  ];

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
      componentProps: {
        origin: DataTypes.ORDER
      }
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      this.selectedClient = data;
      //console.log('Selected client for order:', this.selectedClient);
      this.cdr.markForCheck();
    }
  }

  async openClientActionSheet() {
    this.isClientActionSheetOpen.set(true);
  }

  async openDesignActionSheet() {
    this.isDesignActionSheetOpen.set(true);
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

  onDateChange(event: CustomEvent) {
    console.log(event.detail.value);
    console.log(this.selectedDate);
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

  ngOnDestroy(): void {
    let paramKey!: string;
    
    if(this.client) {
      paramKey = 'client'
    } else {
      paramKey = 'style'
    }

    this.selectedClient = undefined;
    this.selectedDesign = undefined;
    this.router.navigate([], {
      relativeTo: this.ar,
      queryParams: {
        [paramKey]: null // Setting to null or undefined removes it from the URL
      },
      queryParamsHandling: 'merge' // Merges with current params so other params remain
    });

    this.cdr.markForCheck();
  }

  submit() {}
}
