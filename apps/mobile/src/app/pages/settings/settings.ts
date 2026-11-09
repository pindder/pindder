import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, 
  IonTitle, IonToggle, IonToolbar, IonBackButton, IonButtons, 
  ViewWillEnter,
  AlertController
} from '@ionic/angular';
import { ProfileCard } from "../../components/profile-card/profile-card";
import { TokenService } from '../../services/token.service';
import { countries, IProfile } from '@pindder/contracts';
import { SseService } from '../../services/sse.service';

@Component({
  selector: 'app-settings',
  imports: [
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonItem,
    IonList,
    IonToggle,
    IonLabel,
    IonBackButton,
    IonButtons,
    ProfileCard,
    RouterLink,
    ProfileCard
],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements ViewWillEnter{
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private sseService = inject(SseService);
  private cdr = inject(ChangeDetectorRef);
  private alertCtrl = inject(AlertController);

  profile = signal<IProfile>({
    firstname: '',
    lastname: '',
    username: '',
    currentBalance: 0,
    countryCode: countries[38].code,
    tel: '',
    profileImg: '',
    referralCode: '',
    email: '',
  });

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profileStr = await this.tokenService.getProfile();
    if(profileStr) {
      this.profile.set(JSON.parse(profileStr));
    }
    this.cdr.markForCheck();
  }

  openProfileEdit() {
    this.router.navigate(['app/profile/edit']);
  }

  async presentLogoutConfirmationAlert() {
    const alert = await this.alertCtrl.create({
      header: `Confirm Logout`,
      message: `Are you sure you want to logout?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.tokenService.clearToken();
    // START THE REAL-TIME STREAM IMMEDIATELY
    this.sseService.disconnectAllEventSources();
    this.router.navigate(["auth"]);
  }
}
