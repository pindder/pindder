import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonButtons, IonContent, IonHeader, 
  IonList, IonTitle, IonToolbar, ViewWillEnter, 
  IonBackButton
} from '@ionic/angular';
import { TokenService } from '../../services/token.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationTile } from '../../components/notification-tile/notification-tile';
import { IProfile } from '@pindder/contracts';

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
export class Notification implements ViewWillEnter{
  private tokenService = inject(TokenService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  profile!: IProfile;
  notifications = this.notificationService.notifications;

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profile = await this.tokenService.getProfile();
    this.profile = profile ? JSON.parse(profile) : null;
    // Only fetch if we haven't loaded them yet in this session!
    if (!this.notificationService.hasLoaded()) {
      this.fetchNotifications();                                                                  
    }                                                                                                                                                                                               
  }

  fetchNotifications() {
    if(!this.profile._id) {
      return;                                                                                                                   
    }

    this.notificationService.getNotifications(this.profile._id).subscribe({
      next: (res) => {
        // this.notifications = res.data;
        if(res.data) {
          this.notificationService.setInitialNotifications(res.data);
        }
        
        this.cdr.markForCheck();
      }
    });
  }
}
