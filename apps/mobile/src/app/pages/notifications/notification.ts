import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, 
  IonList, IonTitle, IonToolbar, ViewWillEnter, 
  IonBackButton
} from '@ionic/angular';
import { SseService } from '../../services/sse.service';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { INotification } from '@pindder/contracts';
import { NotificationService } from '../../services/notification.service';
import { NotificationTile } from '../../components/notification-tile/notification-tile';

@Component({
  imports: [
    IonHeader, IonToolbar, 
    IonButtons, IonBackButton, IonTitle,
    IonContent, IonList,
    NotificationTile
],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit, ViewWillEnter, OnDestroy{
  private sseService = inject(SseService);
  private tokenService = inject(TokenService);
  private sseSubscription?: Subscription;
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  profile!: any;
  notifications: INotification[] = [];

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  ngOnInit(): void {  }

  async loadProfile() {
    const profile = await this.tokenService.getProfile();
    this.profile = profile ? JSON.parse(profile) : null;
    this.connectNotifications(this.profile?._id);
    this.fetchNotifications();
  }

  fetchNotifications() {
    this.notificationService.getNotifications(this.profile._id).subscribe({
      next: (res) => {
        this.notifications = res.data;
        this.cdr.markForCheck();
      }
    });
  }

  private connectNotifications(userId: string) {
    // Prevent duplicate connections if already connected
    if (this.sseSubscription) return;

    this.sseSubscription = this.sseService
      .connectToNotificationStream(userId)
      .subscribe({
        next: (notification) => {
          console.log('New notification received:', notification);
          // Show toast alert, trigger local notification badge count, etc.
        },
        error: (err) => {
          console.error('SSE Connection Error:', err);
        },
      });
  }

  private disconnectNotifications() {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe(); // Automatically closes the EventSource
      this.sseSubscription = undefined;
    }
  }

  ngOnDestroy() {
    this.disconnectNotifications();
  }
}
