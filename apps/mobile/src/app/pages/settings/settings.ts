import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  ViewWillEnter,
  AlertController
} from '@ionic/angular';
import { ProfileCard } from "../../components/profile-card/profile-card";
import { TokenService } from '../../services/token.service';
import { countries, IProfile, SettingsSection } from '@pindder/contracts';
import { SseService } from '../../services/sse.service';
import { LibSettings } from '@pindder/shared-ui';
import { Browser } from '@capacitor/browser';

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
    IonBackButton,
    IonButtons,
    ProfileCard,
    ProfileCard,
    LibSettings
],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements ViewWillEnter, OnInit {
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private sseService = inject(SseService);
  private cdr = inject(ChangeDetectorRef);
  private alertCtrl = inject(AlertController);

  settingsItems!: SettingsSection[];
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

  ngOnInit(): void {
    this.settingsItems = [
      { id: '1', name: 'Account Details', subItems: [
          { id: 'a', icon: 'business-outline', title: 'business details', route: '/app/profile/brand', path: 'brand' },
          { id: 'b', icon: 'card-outline', title: 'account details', route: '/app/profile/bank-details', path: 'bank-details' },
          { id: 'c', icon: 'albums-outline', title: 'pindder premium', route: '/app/profile/premium', path: 'premium' },
        ]
      },
      { id: '2', name: 'Support', subItems: [
          { id: 'a', icon: 'help-buoy-outline', title: 'help center', action: 'navigate', callback: () => this.openExternalWebpage(`https://pindder-web.onrender.com/help`) },
          { id: 'b', icon: 'headset-outline', title: 'get in touch', route: '/app/profile/contact', path: 'get-in-touch' },
        ]
      },
      { id: '3', name: 'Legal', subItems: [
          { id: 'a', icon: 'shield-checkmark-outline', title: 'usage policy', action: 'navigate', callback: () => this.openExternalWebpage('https://pindder-web.onrender.com/privacy-policy') },
          { id: 'b', icon: 'document-text-outline', title: 'terms of use', action: 'navigate', callback: () => this.openExternalWebpage('https://pindder-web.onrender.com/terms-and-condition') },
        ]
      },
      { id: '4', name: 'Manage Profile', color: 'danger', subItems: [
          { id: 'a', icon: 'trash-outline', title: 'delete account', action: 'delete', callback: () => this.deleteAccount() },
          { id: 'b', icon: 'log-out-outline', title: 'logout', action: 'logout', callback: () => this.presentLogoutConfirmationAlert() },
        ]
      },
    ]
  }

  async openExternalWebpage(url: string) {
    console.log('opening browser');
    await Browser.open({ 
      url: url, 
      toolbarColor: '#F1641D',         // Sets the header/toolbar background color
      presentationStyle: 'fullscreen',
    });
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

  dispatchAction($event: any) {
    $event();
  }

  logout() {
    this.tokenService.clearToken();
    // START THE REAL-TIME STREAM IMMEDIATELY
    this.sseService.disconnectAllEventSources();
    this.router.navigate(["auth"]);
  }

  deleteAccount() {
    return;
  }
}
