import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonFab, 
  IonIcon, IonButton, IonModal, IonItem, IonList, IonButtons, IonAvatar, 
  IonLabel, IonActionSheet, IonCol, IonRow, IonGrid, IonCard, IonListHeader, 
} from "@ionic/angular";
import { ReferralBlock } from "../../components/referral-block/referral-block";
import { DataTile } from "../../components/data-tile/data-tile";
import { NotificationTile } from "../../components/notification-tile/notification-tile";

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
    IonButtons,
    IonList,
    IonItem,
    IonIcon,
    IonFab,
    IonFabButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    DragDropModule,
    ReferralBlock,
    DataTile,
    NotificationTile,
    IonListHeader,
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public environmentInjector = inject(EnvironmentInjector);

  presentingElement!: HTMLElement | null;
  public isActionSheetOpen = signal<boolean>(false);
  public isModalOpen = signal<boolean>(false);
  public actionSheetButtons = [
    {
      text: 'New Client',
      icon: 'clipboard-outline',
      handler: () => {

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
        this.isModalOpen.set(true);
      },
    },
    {
      text: 'New Order',
      icon: 'cart-outline',
      handler: () => {

      },
    },
    // {
    //   text: 'Cancel',
    //   role: 'cancel',
    //   data: {
    //     action: 'cancel',
    //   },
    // },
  ];
  public tiles = [
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
  public notifications = [
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
      message: 'Someone recently viewed your catalog',
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
      message: 'You initiated a withdrawal request',
      amount: '',
      icon: '',
      color: '',
      date: ''
    },
  ];

  ngOnInit(): void {
    this.presentingElement = document.querySelector('.ion-page');
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }
}
