import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonList, ViewWillEnter, IonLabel, 
  ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, 
  IonListHeader, ModalController, IonDatetime, IonActionSheet, IonItemOption, 
  IonAvatar, IonItemOptions, IonItemSliding
} from "@ionic/angular";
import { DataTypes, IClient, IDesign, IOrder } from '@pindder/contracts';
import { OrderStatus } from '@pindder/contracts';
import { NewClient } from '../new-client/new-client';
import { ClientSelection } from '../client-selection/client-selection';
import { NewDesign } from '../new-design/new-design';
import { DesignSelection } from '../design-selection/design-selection';
import { ActivatedRoute, Router } from '@angular/router';
import { EmptyState } from '../empty-state/empty-state';
import { DesignView } from '../../pages/design-view/design-view';
import { Measurement } from '../measurement/measurement';
import { CloudinaryModule } from '@cloudinary/ng';
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SizesModal } from '../sizes-modal/sizes-modal';

@Component({
  selector: 'app-new-order',
  imports: [ 
    IonItemOptions, 
    IonAvatar, 
    IonItemOption,
    IonActionSheet,
    IonDatetime,
    IonLabel, 
    IonContent,
    IonList, 
    IonItem, 
    IonButton, 
    FormsModule,
    IonHeader, 
    IonToolbar,
    IonButtons, 
    IonIcon, 
    IonTitle,
    IonListHeader, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    FormsModule,
    IonItemSliding,
    EmptyState, 
    CloudinaryModule
  ],
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
  private orderService = inject(OrderService);

  presentingElement!: HTMLElement | null;
  selectedClient!: any;
  styleAvailableSizes: string[] = [];
  activeAvailableStyleSizesIndex!: number;

  order: IOrder = {
    totalAmount: 0,
    deliveryDate: '',
    measurement: '',
    totalItems: 0,
    status: OrderStatus.PENDING,
    styles: [],
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
      this.order.styles.push({
        styleId: this.design._id!,
        design: this.design,
        sizes: [],
        quantity: 1, 
      });
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
    const { data } = await modal.onWillDismiss();
    if (data) {
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

    //Listen for the created design payload when dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.order.styles.push({
        styleId: data._id,
        design: data,
        sizes: [],
        quantity: 1, 
      });
      this.order.totalAmount += data.amount
    }

    this.cdr.markForCheck();
  }

  async openSelectDesignModal() { 
    const modal = await this.modalCtrl.create({
      component: DesignSelection, // Standalone modal component for searching clients
    });

    await modal.present();

    //Listen for the selected design payload when dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.order.styles.push({
        styleId: data._id,
        design: data,
        sizes: [],
        quantity: 1, 
      });

      this.order.totalAmount += data.amount
    }

    this.cdr.markForCheck();
  }

  async viewDesignDetails(design: IDesign) {
    const modal = await this.modalCtrl.create({
      component: DesignView,
      canDismiss: true,
      componentProps: {
        design: design
      }
    });

    await modal.present();
  }



  ngOnInit() {
  }

  onDateChange(event: CustomEvent) {
    console.log(event.detail.value);
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  removeSelectedClient() {
    this.selectedClient = undefined;
  }

  removeSelectedDesign(index: number) {
    this.order.styles.splice(index, 1);
    this.cdr.markForCheck();
  }

  presentToast() {
    this.toastCtrl.create({
      color: 'primary',
      animated: true,
      duration: 4000,
      position: 'top'
    });
  }

  decrementQuantity(index: number) {
    this.order.styles[index].quantity--;
    this.order.totalAmount -= this.order.styles[index].design.amount;
  }

  incrementQuantity(index: number) {
    this.order.styles[index].quantity++;
    this.order.totalAmount += this.order.styles[index].design.amount;
  }

  async selectSize(index: number, sizes: any) {
    this.activeAvailableStyleSizesIndex = index;
    this.styleAvailableSizes = sizes;
    const modal = await this.modalCtrl.create({
      component: SizesModal,
      componentProps: {
        sizes: this.styleAvailableSizes
      }
    });

    await modal.present();
  }

  async openMeasurementModal() {
    const modal = await this.modalCtrl.create({
      component: Measurement,
      canDismiss: true,
      handle: true,
      componentProps: {
        client_id: this.selectedClient._id
      }
    });

    await modal.present();
  }

  ngOnDestroy(): void {
    let paramKey!: string;
    
    if(this.client) {
      paramKey = 'client'
    } else {
      paramKey = 'style'
    }

    this.selectedClient = undefined;

    this.router.navigate([], {
      relativeTo: this.ar,
      queryParams: {
        [paramKey]: null // Setting to null or undefined removes it from the URL
      },
      queryParamsHandling: 'merge' // Merges with current params so other params remain
    });

    this.cdr.markForCheck();
  }

  submit() {
    this.order.client = this.selectedClient._id;
    this.order.styles.forEach((item) => {
      this.order.totalItems += item.quantity
    });

    console.log(this.order);
    
    this.orderService.createOrder(this.order).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
}
