import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonList, ViewWillEnter, 
  IonLabel, ToastController, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonIcon, IonListHeader, ModalController, IonDatetime, 
  IonActionSheet, IonItemOption, IonAvatar, IonItemOptions, IonItemSliding, 
  IonTextarea, IonNote, IonModal, IonSelect, IonSelectOption
} from "@ionic/angular";
import { DataTypes, DeliveryMethods, DesignTypes, IClient, IColors, IDesign, IOrder, IOrderItem, IOrderStyle, ISpecification } from '@pindder/contracts';
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
import { PrimaryButton } from '../primary-button/primary-button';
import { OrderView } from '../../pages/order-view/order-view';

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
    IonSelect, IonSelectOption,
    OrderView,
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
  completeOrder!: IOrderItem;

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

  isPreview: boolean = false;

  ionViewWillEnter(): void {
    // console.log(this.client);
    // console.log(this.design);
    if(this.client) {
      this.selectedClient = this.client;
    } else if(this.design) {
      // let selections: any[] = [];

      // this.design.specifications.forEach((spec: ISpecification) => {
      //   selections.push({...spec, colors: [], quantity: 0 });
      // });

      this.order.styles.push({
        amount: this.design.amount,
        description: this.design.description,
        dueDate: '',
        images: this.design.images,
        type: this.design.type,
        name:  this.design.name,
        specifications: this.design.specifications,
        selections: [],
        colors: this.design.colors ?? [],
        selectedColors: [],
        catalogDisplay: false,
        //design: data,
        totalAmount: 0,
        totalItems: 0,
        quantity: 0
      });
    }

    if(this.order.styles.length > 0) {
      this.order.styles.forEach((style: IOrderStyle) => {
        style.selections.forEach((selection: ISpecification) => {
          selection.quantity > 0 ? this.order.totalAmount += selection.amount : 0
        });
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
      // let selections: any[] = [];

      // data.specifications.forEach((spec: ISpecification) => {
      //   selections.push({...spec, colors: [], quantity: 0 });
      // });

      this.order.styles.push({
        _id: data._id,
        amount: data.amount,
        description: data.description,
        dueDate: '',
        images: data.images,
        type: data.type,
        name:  data.name,
        specifications: data.specifications,
        selections: [],
        colors: data.colors ?? [],
        selectedColors: [],
        catalogDisplay: data.catalogDisplay,
        //design: data,
        totalAmount: 0,
        totalItems: 0,
        quantity: 0
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
      // let selections: any[] = [];

      // data.specifications.forEach((spec: ISpecification) => {
      //   selections.push({...spec, colors: [], quantity: 0 });
      // });

      this.order.styles.push({
        _id: data._id,
        amount: data.amount,
        description: data.description,
        dueDate: '',
        images: data.images,
        type: data.type,
        name:  data.name,
        specifications: data.specifications,
        selections: [],
        colors: data.colors ?? [],
        selectedColors: [],
        catalogDisplay: data.catalogDisplay,
        //design: data,
        totalAmount: 0,
        totalItems: 0,
        quantity: 0, 
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

  decrementQuantity(specification: ISpecification) {
    const index = this.selectedStyle.specifications.indexOf(specification);

    if(this.selectedStyle.selections && this.selectedStyle.selections.length > 0) {
      const selection = this.selectedStyle.selections.find((selection) => selection.size === this.selectedStyle.specifications[index].size);
      if(selection && selection.quantity > 0) {
        selection.inStock! += 1;
        selection.quantity -= 1;
        this.selectedStyle.selections[index] = selection;
        this.selectedStyle.totalAmount -= selection.amount; 
        this.order.totalAmount -= selection.amount;
      }

    }
    //console.log(this.selectedStyle.selections);
    this.cdr.markForCheck();
  }

  incrementQuantityBespoke() {
    this.selectedStyle.quantity++;
    this.order.totalAmount += this.selectedStyle.amount;
  }

  decrementQuantityBespoke() {
    if(this.selectedStyle.quantity > 0) {
      this.selectedStyle.quantity--;
      this.order.totalAmount -= this.selectedStyle.amount;
    }
  }

  incrementQuantity(specification: ISpecification) {
    const specIndex = this.selectedStyle.specifications.indexOf(specification!);
    if(this.selectedStyle.selections.length > 0) {
      const selection = this.selectedStyle.selections.find((selection) => selection.size === this.selectedStyle.specifications[specIndex].size);
      
      if(selection) {
        selection.inStock! -= 1;
        selection.quantity += 1;
        this.selectedStyle.selections[specIndex] = selection;
        this.selectedStyle.totalAmount += selection.amount;
        this.order.totalAmount += selection.amount;
      } else {
        this.selectedStyle.selections.push({ 
          ...this.selectedStyle.specifications[specIndex], 
          inStock: this.selectedStyle.specifications[specIndex].quantity - 1, 
          quantity: 1 
        });
      }
    }else {
      this.selectedStyle.selections.push({ 
        ...this.selectedStyle.specifications[specIndex], 
        inStock: this.selectedStyle.specifications[specIndex].quantity - 1, 
        quantity: 1 
      });
    }
    //console.log(this.selectedStyle);

    
    //console.log(this.order);
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

    if(this.selectedStyle.selections.length == 0) {
      let selections: any[] = [];

      this.selectedStyle.specifications.forEach((spec: ISpecification) => {
        selections.push({...spec, colors: [], quantity: 0 });
      });
      this.selectedStyle.selections = selections;
    }
    
    this.modalSheet.present();
  }

  closeModalSheet() {
    if(this.selectedStyle.totalAmount == 0){
      this.selectedStyle.selections = [];
      this.cdr.markForCheck();
    }
    return
  }

  buildOrder() {
    this.order.totalItems = 0;
    this.order.totalAmount = 0;
    this.order.totalItems = 0;

    this.order.client = this.selectedClient._id;
    
    this.order.styles.forEach((item: IOrderStyle) => {
      if(item.type === DesignTypes.BESPOKE) {
        this.order.totalItems = item.quantity;
        this.order.totalAmount += (item.amount * item.quantity);
      } else {
        item.selections.forEach((selection: ISpecification, index: number) => {
          if(selection.quantity == 0) {
            //this.presentToast('Please select at least one item to proceed', 'danger', 'bottom');
            //return;  

            if(item.amount > 0) {
              item.totalAmount = item.amount;
            }
            item.selections.splice(index, 1);
          } else {
            this.order.totalItems += selection.quantity;
            item.totalItems += selection.quantity;
            item.totalAmount += selection.amount;
          }
        });
      }
    });

    if(this.order.totalItems === 0) {
      if(this.order)
      this.presentToast('Please select at least one item to proceed', 'danger', 'bottom');
      return;
    }

    if(!this.order.dueDate) {
      this.presentToast('Please select a due date for the order', 'danger', 'bottom');
      return;
    }

    this.completeOrder = {
      _id: this.order._id!,
      client: this.selectedClient,
      orderId: '',
      styles: this.order.styles,
      totalAmount: this.order.totalAmount,
      totalItems: this.order.totalItems,
      measurement: this.order.measurement,
      deliveryMethod: this.order.deliveryMethod,
      dueDate: this.order.dueDate,
      status: OrderStatus.PENDING,
      createdAt: Date.now().toLocaleString(),
      updatedAt: Date.now().toLocaleString(),
      note: this.order.note,
    }
    this.isPreview = !this.isPreview;
    console.log(this.order);
    console.log(this.completeOrder);
    this.cdr.markForCheck();
  }

  submit() {
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

  isColorSelected(color: IColors, specIndex?: number): boolean {
    if(specIndex) {
      return this.selectedStyle.selections[specIndex].colors.some((c) => c._id === color._id);
    } else {
      return this.selectedStyle.selectedColors.some((c) => c._id === color._id);
    }
  }

  toggleColor(color: IColors, specIndex?: number): void {
    let colorIndex;

    if(specIndex) {
      colorIndex = this.selectedStyle.selections[specIndex].colors.findIndex((c) => c.name === color.name);

      if(this.isColorSelected(color, specIndex)) {
        this.selectedStyle.selections[specIndex].colors.splice(colorIndex, 1);  
      } else {
        this.selectedStyle.selections[specIndex].colors.push(color);
      }
    } else {
      colorIndex = this.selectedStyle.colors.findIndex((c) => c._id === color._id);

      if(this.isColorSelected(color)) {
        this.selectedStyle.selectedColors.splice(colorIndex, 1);
      } else {
        this.selectedStyle.selectedColors.push(color);
      }
    }
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
