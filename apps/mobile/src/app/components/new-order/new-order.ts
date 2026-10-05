import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonList, ViewWillEnter, IonLabel, 
  ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, 
  IonListHeader, ModalController, IonDatetime, IonActionSheet, IonItemOption, 
  IonAvatar, IonItemOptions, IonItemSliding, IonTextarea, IonNote,
  IonModal, IonSelect, IonSelectOption
} from "@ionic/angular";
import { DataTypes, DeliveryMethods, DesignTypes, IClient, IColors, IDesign, IOrder, IOrderStyle, ISizeQuantity, ISpecification } from '@pindder/contracts';
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
//import { SizesModal } from '../sizes-modal/sizes-modal';
import { PrimaryButton } from '../primary-button/primary-button';

@Component({
  selector: 'app-new-order',
  imports: [
    IonModal,
    IonNote, IonTextarea,
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
    CloudinaryModule, IonNote,
    PrimaryButton,
    IonSelect, IonSelectOption
],
  templateUrl: './new-order.html',
  styleUrl: './new-order.css',
})
export class NewOrder implements ViewWillEnter, OnInit, OnDestroy{
  @Input() client?: IClient;
  @Input() design?: IDesign;
  @ViewChild('modal') modalSheet!: IonModal;

  private cdr = inject(ChangeDetectorRef);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private ar = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  
  sizeAndQuantity: ISizeQuantity[] = [];
  presentingElement!: HTMLElement | null;
  selectedClient!: any;
  selectedStyleIndex!: number;
  selectedStyle!: IOrderStyle;

  order: IOrder = {
    totalAmount: 0,
    dueDate: '',
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

  deliveryMethods = Object.keys(DeliveryMethods);
  deliveryMethod = DeliveryMethods;
  designTypes = DesignTypes;

  ionViewWillEnter(): void {
    // console.log(this.client);
    // console.log(this.design);
    if(this.client) {
      this.selectedClient = this.client;
    } else if(this.design) {
      let selections: any[] = [];

      this.design.specifications.forEach((spec: ISpecification) => {
        selections.push({...spec, colors: [], quantity: 0 });
      });

      this.order.styles.push({
        amount: this.design.amount,
        description: this.design.description,
        dueDate: '',
        images: this.design.images,
        type: this.design.type,
        name:  this.design.name,
        selectedSizesAndQuantities: this.sizeAndQuantity,
        specifications: this.design.specifications,
        selections: selections ?? [],
        colors: [],
        catalogDisplay: false,
        //design: data,
        sizes: this.design.sizes,
        totalAmount: this.design.sizes > 0 ? 0 : this.design.amount,
        totalItems: this.design.sizes > 0 ? 0 : 1,
        quantity: this.design.sizes > 0 ? 0 : 1
      });
    }

    if(this.order.styles.length > 0) {
      this.order.styles.forEach((style: IOrderStyle) => {
        this.order.totalAmount += (style.amount * style.quantity);
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
      componentProps: {
        parentComponent: DataTypes.ORDER
      }
    });

    await modal.present();

    //Listen for the created design payload when dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      let selections: any[] = [];

      data.specifications.forEach((spec: ISpecification) => {
        selections.push({...spec, colors: [], quantity: 0 });
      });

      this.order.styles.push({
        _id: data._id,
        amount: data.amount,
        description: data.description,
        dueDate: '',
        images: data.images,
        type: data.type,
        name:  data.name,
        selectedSizesAndQuantities: [],
        specifications: data.specifications,
        selections: selections ?? [],
        colors: [],
        catalogDisplay: data.catalogDisplay,
        //design: data,
        totalAmount: data.sizes > 0 ? 0 : data.amount,
        totalItems: data.sizes > 0 ? 0 : 1,
        sizes: data.sizes,
        quantity: data.sizes > 0 ? 0 : 1
      });
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
      let selections: any[] = [];

      data.specifications.forEach((spec: ISpecification) => {
        selections.push({...spec, colors: [], quantity: 0 });
      });

      this.order.styles.push({
        _id: data._id,
        amount: data.amount,
        description: data.description,
        dueDate: '',
        images: data.images,
        type: data.type,
        name:  data.name,
        selectedSizesAndQuantities: this.sizeAndQuantity,
        specifications: data.specifications,
        selections: selections ?? [],
        colors: [],
        catalogDisplay: data.catalogDisplay,
        //design: data,
        totalAmount: data.sizes > 0 ? 0 : data.amount,
        totalItems: data.sizes > 0 ? 0 : 1,
        sizes: data.sizes,
        quantity: data.sizes > 0 ? 0 : 1, 
      });
    }

    this.cdr.markForCheck();
  }

  async viewDesignDetails(design: IOrderStyle) {
    console.log(design);
    const modal = await this.modalCtrl.create({
      component: DesignView,
      canDismiss: true,
      componentProps: {
        design: design,
        dataType: DataTypes.ORDER
      }
    });

    await modal.present();
  }

  ngOnInit() {
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

  decrementQuantity(index: number) {
    if(this.selectedStyle.selections && this.selectedStyle.selections.length > 0) {
      const selection = this.selectedStyle.selections.find((selection) => selection.size === this.selectedStyle.specifications[index].size);
      if(selection && selection.quantity > 0) {
        selection.inStock! += 1;
        selection.quantity -= 1;
        this.selectedStyle.selections[index] = selection;
        this.selectedStyle.totalAmount = selection.amount * selection.quantity
      }

    }
    console.log(this.selectedStyle.selections);
    
    this.order.totalAmount += this.selectedStyle.amount;

    this.cdr.markForCheck();
  }

  incrementQuantity(index: number) {
    if(this.selectedStyle.selections && this.selectedStyle.selections.length > 0) {
      const selection = this.selectedStyle.selections.find((selection) => selection.size === this.selectedStyle.specifications[index].size);
      if(selection) {
        selection.inStock! -= 1;
        selection.quantity += 1;
        this.selectedStyle.selections[index] = selection;
        this.selectedStyle.totalAmount = selection.amount * selection.quantity
      } else {
        this.selectedStyle.selections.push({ 
          ...this.selectedStyle.specifications![index], 
          inStock: this.selectedStyle.specifications![index].quantity - 1, 
          quantity: 1 
        });
      }
    }else {
      this.selectedStyle.selections = [];
      this.selectedStyle.selections.push({ 
        ...this.selectedStyle.specifications![index], 
        inStock: this.selectedStyle.specifications![index].quantity - 1, 
        quantity: 1 
      });
    }
    console.log(this.selectedStyle.selections);
    
    this.order.totalAmount += this.selectedStyle.amount;

    this.cdr.markForCheck();
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

  openModalSheet(index: number, style: IOrderStyle) {
    this.selectedStyle = style;
    this.selectedStyleIndex = index;
    //console.log(this.selectedStyle);
    this.modalSheet.present();
    // if(style.sizes && style.sizes?.length > 0) {
    //   this.modalSheet.present();
    // } else {
    //   this.viewDesignDetails(style);
    // }
  }

  submit() {
    this.order.totalItems = 0;

    this.order.client = this.selectedClient._id;
    this.order.styles.forEach((item: IOrderStyle) => {
      this.order.totalItems += item.totalItems;
      if(item.selections.length == 0) {
        this.presentToast('Please select at least one item to proceed', 'danger', 'top');
        return;  
      }

    });

    if(this.order.totalItems === 0) {
      this.presentToast('Please select at least one item to proceed', 'danger', 'top');
      return;
    }

    if(!this.order.dueDate) {
      this.presentToast('Please select a due date for the order', 'danger', 'top');
      return;
    }

    //console.log(this.order);
    
    this.orderService.createOrder(this.order).subscribe({
      next: (res: any) => {
        this.presentToast(res.msg, 'primary', 'top');
        this.router.navigate(['app/orders']);
        this.modalCtrl.dismiss(res.data, 'order');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  isColorSelected(color: IColors, specIndex: number): boolean {
    return this.selectedStyle.selections[specIndex].colors.some((c) => c._id === color._id);
  }

  toggleColor(color: IColors, specIndex: number): void {
    const colorIndex = this.selectedStyle.selections[specIndex].colors.findIndex((c) => c.name === color.name);
    // if (index > -1) {
    //   this.selectedStyle.selections[specIndex].colors.splice(index, 1);  
    // } else {
    //   this.selectedStyle.selections[specIndex].colors.push(color);
    // }
    if(this.isColorSelected(color, specIndex)) {
      this.selectedStyle.selections[specIndex].colors.splice(colorIndex, 1);  
    } else {
      this.selectedStyle.selections[specIndex].colors.push(color);
    }
    
    console.log(this.selectedStyle.selections[specIndex]);
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
