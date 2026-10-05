import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EnvironmentInjector, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonFabButton, IonFab, 
  IonIcon, IonButton, IonList, 
  IonLabel, IonActionSheet, IonCol, IonRow, IonGrid, IonListHeader,
  ViewWillEnter,
  ModalController,
  ToastController, 
} from "@ionic/angular";
import { ReferralBlock } from "../../components/referral-block/referral-block";
import { DataTile } from "../../components/data-tile/data-tile";
import { NotificationTile } from "../../components/notification-tile/notification-tile";
import { NewClient } from "../../components/new-client/new-client";
import { NewOrder } from "../../components/new-order/new-order";
import { NewDesign } from "../../components/new-design/new-design";
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ProfileCard } from '../../components/profile-card/profile-card';
import { EmptyState } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-dashboard',
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonActionSheet,
    IonLabel,
    IonButton,
    IonList,
    IonIcon,
    IonFab,
    IonFabButton,
    IonContent,
    DragDropModule,
    ReferralBlock,
    DataTile,
    NotificationTile,
    IonListHeader,
    ProfileCard,
    EmptyState
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements ViewWillEnter, OnInit{
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

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
      handler: async () => {
        const modal = await this.modalCtrl.create({
          component: NewClient,
        });

        await modal.present()
      },
      // role: 'destructive',
      data: {
        action: 'create',
      },
    },
    {
      text: 'New Style',
      icon: 'color-palette-outline',
      handler: async () => {
        const modal = await this.modalCtrl.create({
          component: NewDesign,
        });

        await modal.present()
      },
    },
    {
      text: 'New Order',
      icon: 'bag-add-outline',
      handler: async () => {
        const modal = await this.modalCtrl.create({
          component: NewOrder,
        });

        await modal.present()
      },
    },
  ];
  tiles = [
    {
      title: "Pending",
      icon: "hourglass-outline",
      count: 24,
      color: "medium"
    },
    {
      title: "Ongoing",
      icon: "time-outline",
      count: 24,
      color: "warning"
    },
    {
      title: "Completed",
      icon: "bag-check-outline",
      count: 24,
      color: "success"
    },
    {
      title: "Overdue",
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
  catalog!: string;
  referralLink!: string;

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
    this.catalog = `https://pindder.com/${this.profile.username}`;
  }

  openNotificationsModal() {}

  clearRecentNotifications() {
    this.notifications = [];
  }

  gotoOrder($event: any) {
    this.router.navigate(['app/orders'], { queryParams: { status: $event }});
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async shareLink(): Promise<void> {
    const shareData = {
      title: 'Join me on YourAppName!',
      text: `Use my referral code ${this.profile.username} to get 10% off your first order!`,
      url: this.referralLink
    };

    // Use Native Web Share API if supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User canceled or sharing failed silently
      }
    } else {
      // Fallback: Copy link to clipboard
      await this.copyToClipboard();
    }
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.referralLink);
      await this.showToast('Referral link copied to clipboard!');
    } catch (err) {
      await this.showToast('Failed to copy link. Please copy manually.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
