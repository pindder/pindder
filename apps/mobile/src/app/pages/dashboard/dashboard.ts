import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { IonContent, IonFabButton, IonFab, IonIcon, IonList, IonActionSheet,
  ViewWillEnter, ModalController, ToastController, IonLabel, IonModal 
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
import { INotification } from '@pindder/contracts';
import { NotificationService } from '../../services/notification.service';
import { SseService } from '../../services/sse.service';
import { Subscription } from 'rxjs';
import { EarningsCard } from '../../components/earnings-card/earnings-card';
import { Share } from '@capacitor/share';
import { Payout } from '../../components/payout/payout';

@Component({
  selector: 'app-dashboard',
  imports: [IonModal, IonLabel,
    IonActionSheet,
    IonList,
    IonIcon,
    IonFab,
    IonFabButton,
    IonContent,
    DragDropModule,
    ReferralBlock,
    DataTile,
    NotificationTile,
    ProfileCard,
    EmptyState, EarningsCard, Payout],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements ViewWillEnter{
  private notificationService = inject(NotificationService);
  private sseService = inject(SseService);

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private sseSubscription?: Subscription;

  profile!: any;
  environmentInjector = inject(EnvironmentInjector);
  presentingElement!: HTMLElement | null;
  userBalance = signal<number>(0);
  
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
      count: 3,
      color: "medium"
    },
    {
      title: "Ongoing",
      icon: "time-outline",
      count: 2,
      color: "warning"
    },
    {
      title: "Completed",
      icon: "bag-check-outline",
      count: 5,
      color: "success"
    },
    {
      title: "Overdue",
      icon: "alarm-outline",
      count: 2,
      color: "danger"
    },
    {
      title: "Cancelled",
      icon: "bag-remove-outline",
      count: 1,
      color: "danger"
    }
  ];
  notifications: INotification[] = [];
  catalog!: string;
  referralLink!: string;
  isSharingSupported = signal<boolean>(false);
  
  ionViewWillEnter(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profile = await this.tokenService.getProfile();
    this.profile = profile ? JSON.parse(profile) : null;
    this.catalog = `https://pindder.com/${this.profile.username}`;
    this.cdr.markForCheck();
    this.fetchNotifications();
    this.connectNotifications(this.profile._id);


    try {
      // Check if the current platform/browser supports sharing
      const result = await Share.canShare();
      this.isSharingSupported.set(result.value);
    } catch (error) {
      console.error('Error checking share capability:', error);
      this.isSharingSupported.set(false);
    }
  }

  fetchNotifications() {
    this.notificationService.getRecentNotifications(this.profile._id).subscribe({
      next: (res) => {
        this.notifications = res.data;
        this.cdr.markForCheck();
      }
    });
  }

  private connectNotifications(userId: string) {
    // Prevent duplicate connections if already connected
    if (this.sseSubscription) return;

    this.sseService.connectToNotificationStream(userId)
  }

  openNotifications() {
    this.router.navigate(['notifications']);
  }

  clearRecentNotifications() {
    this.notifications = [];
  }

  gotoOrder($event: any) {
    this.router.navigate(['app/orders'], { queryParams: { status: $event }});
  }

  gotoEarn() {
    this.router.navigate(['app/referrals']);
  }

  gotoPayout() {
    return;
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async shareLink() {
    if (!this.isSharingSupported()) return;

    try {
      await Share.share({
        title: 'Check out pindder!',
        text: 'Hey, kindly check out my design catalog on pindder.',
        url: `https://pindder.com/${this.profile.username}`, // The link you want to share
        dialogTitle: 'Share pindder with friends', // Android only title for the popup
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.catalog);
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
