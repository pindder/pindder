import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EnvironmentInjector, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonFabButton, IonFab, 
  IonIcon, IonButton, IonModal, IonItem, IonList, IonAvatar, 
  IonLabel, IonActionSheet, IonCol, IonRow, IonGrid, IonCard, IonListHeader,
  ViewWillEnter,
  ModalController, 
} from "@ionic/angular";
import { ReferralBlock } from "../../components/referral-block/referral-block";
import { DataTile } from "../../components/data-tile/data-tile";
import { NotificationTile } from "../../components/notification-tile/notification-tile";
import { NewClient } from "../../components/new-client/new-client";
import { NewOrder } from "../../components/new-order/new-order";
import { NewDesign } from "../../components/new-design/new-design";
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { DataTypes } from '@pindder/contracts';

@Component({
  selector: 'app-dashboard',
  imports: [
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonActionSheet,
    IonLabel,
    IonAvatar,
    IonModal,
    IonButton,
    IonList,
    IonItem,
    IonIcon,
    IonFab,
    IonFabButton,
    IonContent,
    DragDropModule,
    ReferralBlock,
    DataTile,
    NotificationTile,
    IonListHeader,
    NewClient,
    NewOrder,
    NewDesign
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements ViewWillEnter, OnInit{
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService);
  private modalCtrl = inject(ModalController);

  profile!: any;
  environmentInjector = inject(EnvironmentInjector);
  presentingElement!: HTMLElement | null;
  
  modalContent = signal<string>("");
  isActionSheetOpen = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  actionSheetButtons = [
    {
      text: 'New Client',
      icon: 'person-add-outline',
      handler: () => {
        this.modalContent.set("New Client");
        this.isModalOpen.set(true);
      },
      // role: 'destructive',
      data: {
        action: 'create',
      },
    },
    {
      text: 'New Style',
      icon: 'color-palette-outline',
      handler: () => {
        this.modalContent.set("New Style");
        this.isModalOpen.set(true);
      },
    },
    {
      text: 'New Order',
      icon: 'bag-add-outline',
      handler: () => {
        this.modalContent.set("New Order");
        this.isModalOpen.set(true);
      },
    },
  ];
  tiles = [
    {
      title: "Pending Orders",
      icon: "hourglass-outline",
      count: 24,
      color: "medium"
    },
    {
      title: "Ongoing Orders",
      icon: "time-outline",
      count: 24,
      color: "warning"
    },
    {
      title: "Completed Orders",
      icon: "bag-check-outline",
      count: 24,
      color: "success"
    },
    {
      title: "Overdue Orders",
      icon: "alarm-outline",
      count: 24,
      color: "danger"
    }
  ];
  notifications = [
    {
      id: 'ncaiojmcnio',
      type: 'Order',
      message: 'Someone has placed an order',
      amount: '',
      icon: 'bag-handle-outline',
      color: '',
      date: ''
    },
    {
      id: 'abjhdioadnao',
      type: 'Catalog',
      message: 'Someone viewed your catalog',
      icon: 'albums-outline',
      color: '',
      date: ''
    },
    {
      id: 'bacahiochaiu',
      type: 'Review',
      message: 'Someone has left you a review',
      rating: '',
      icon: 'star-half-outline',
      color: '',
      date: ''
    },
    {
      id: 'jndkanidoklqnk',
      type: 'Security',
      message: 'You logged in successfully at',
      amount: '',
      icon: 'shield-checkmark-outline',
      color: '',
      date: ''
    },
    {
      id: '',
      type: 'Transaction',
      message: 'Withdrawal request initiated',
      amount: '',
      icon: '',
      color: '',
      date: ''
    },
  ];

  ngOnInit(): void {
    this.presentingElement = document.querySelector('.ion-page');
  }
  
  ionViewWillEnter(): void {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadProfile();
    this.cdr.markForCheck();
  }

  async loadProfile() {
    const profile = await this.tokenService.getProfile();
    this.profile = profile ? JSON.parse(profile) : null;
    //console.log(this.profile);
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }

  async closeModal(dataType: string) {
    console.log('Closing modal payload:', dataType);

    // 1. Update your local state signal
    this.isModalOpen.set(false);

    // 2. Programmatically dismiss the active Ionic overlay
    try {
      await this.modalCtrl.dismiss();
    } catch (e) {
      // In case no modal instance was registered via ModalController
    }

    // 3. Navigate after dismissing
    if (!dataType) return;

    switch (dataType) {
      case DataTypes.CLIENT:
        await this.router.navigate(['/app/clients']);
        break;
      case DataTypes.DESIGN:
        await this.router.navigate(['/app/styles']);
        break;
      case DataTypes.ORDER:
        await this.router.navigate(['/app/orders']);
        break;
    }
  }
}
