import { ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController, ToastController, ViewWillEnter } from '@ionic/angular';
import { DeliveryMethods, DesignTypes, IClient, IDesign, IOrder, IOrderItem, IOrderStyle, IResponse, ISpecification, OrderStatus } from '@pindder/contracts';
import { CreateOrder } from '@pindder/shared-ui';
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-order',
  imports: [CreateOrder],
  templateUrl: './new-order.html',
  styleUrl: './new-order.css',
})
export class NewOrder implements ViewWillEnter{
  @Input() client?: IClient;
  @Input() design?: IDesign;
  @Input() existingOrder!: IOrder;
  @ViewChild('modal') modalSheet!: IonModal;

  private cdr = inject(ChangeDetectorRef);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private orderService = inject(OrderService);
  
  presentingElement!: HTMLElement | null;
  selectedClient!: IClient | null;
  selectedStyleIndex!: number;
  selectedStyle!: IOrderStyle;

  order: IOrder = {
    totalAmount: 0,
    dueDate: '',
    measurements: [],
    totalItems: 0,
    status: OrderStatus.PENDING,
    paymentMethod: '',
    deliveryMethod: DeliveryMethods.PICKUP,
    paid: false,
    styles: [],
    client: this.client?._id ?? null
  };
  clients: IClient[] = [];
  designs: IDesign[] = [];
  completeOrder!: IOrderItem;
  isPreview = false;

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
      amount: this.design.amount ?? null,
      description: this.design.description ?? null,
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
  
  if(this.existingOrder) {
    console.log(this.existingOrder);
    this.order = this.existingOrder;
  }
  console.log(this.client);
  console.log(this.order);

  if(this.order.styles.length > 0) {
    this.order.styles.forEach((style: IOrderStyle) => {
      style.selections.forEach((selection: ISpecification) => {
        if(selection.quantity > 0) {
          this.order.totalAmount = this.order.totalAmount + selection.amount;
        } else {
          this.order.totalAmount = 0;
        }
      });
    });
  }
  this.cdr.markForCheck();
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

  buildOrder() {
    let totalAmount = 0; 
    let totalItems = 0
    
    for(const item of this.order.styles) {
      item.totalAmount = 0;
      item.totalItems = 0;

      if(item.amount === null) {
        return;
      }

      if(item.type === DesignTypes.BESPOKE) {
        console.log(item);
        if(item.quantity < 1) {
          this.presentToast(`Please click the ${item.name} style to specify quantity and color`, 'danger', 'bottom');
          return;
        }
        item.totalItems = item.quantity;
        item.totalAmount = item.amount * item.quantity;
        totalAmount += (item.amount * item.quantity);
        totalItems += item.quantity;
      } else if(item.type === DesignTypes.READYMADE) {
        if(item.selections.length == 0) {
          this.presentToast(`Please click the ${item.name} style to specify quantity and colors`, 'danger', 'bottom');
          return;  
        }
        for(const selection of item.selections) {
          console.log(selection, item);
          
          item.totalItems += selection.quantity;
          item.totalAmount += (selection.amount * selection.quantity);
          totalAmount += (selection.amount * selection.quantity);
          totalItems += selection.quantity;
        }
      }
    }

    // console.log(totalAmount, totalItems);
    this.order.totalItems = totalItems;
    this.order.totalAmount = totalAmount;

    if(!this.order.dueDate) {
      this.presentToast('Please select a due date for the order', 'danger', 'bottom');
      return;
    }

    if(this.order.totalItems == 0) {
      this.presentToast('Please select the quantity needed for each style', 'danger', 'bottom');
      return;
    }

    if(!this.order.paymentMethod) {
      this.presentToast('Please select a payment method', 'danger', 'bottom');
      return;
    }

    if(!this.order.deliveryMethod) {
      this.presentToast('Please select a delivery method', 'danger', 'bottom');
      return;
    }

    if(!this.order.client) {
      this.presentToast('Please select a client!', 'danger', 'bottom');
      return;
    }

    this.completeOrder = {
      _id: this.order._id!,
      client: this.selectedClient!,
      orderId: '',
      styles: this.order.styles,
      totalAmount: totalAmount,
      totalItems: totalItems,
      paid: false,
      paymentMethod: this.order.paymentMethod,
      measurements: this.order.measurements,
      deliveryMethod: this.order.deliveryMethod,
      dueDate: this.order.dueDate,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      note: this.order.note,
    }
    this.isPreview = !this.isPreview;
    
    this.cdr.markForCheck();
  }

  submit() {
    if(this.order._id) {
      delete this.order._id;
      this.order.status = OrderStatus.PENDING;
      this.order.paid = false;
    }

    this.order.totalAmount = this.completeOrder.totalAmount;
    this.order.totalItems = this.completeOrder.totalItems;
    this.orderService.createOrder(this.order).subscribe({
      next: (res: IResponse<IOrderItem>) => {
        this.presentToast(res.msg, 'primary', 'top');
        this.router.navigate(['app/orders']);
        this.modalCtrl.dismiss(res.data, 'order');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
}
