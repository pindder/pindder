import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AlertController, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from '@ionic/angular';
import { AccountTypes, IProfile, SettingsSection } from '@pindder/contracts';
import { LibSettings } from '@pindder/shared-ui';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-settings',
  imports: [IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, LibSettings],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private alertCtrl = inject(AlertController);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  settingsItems!: SettingsSection[];
  account!:IProfile;

  async ngOnInit() {
    const profile = await this.tokenService.getProfile();

    if(profile) {
      this.account = JSON.parse(profile);
    }
    
    this.settingsItems = [
      { id: '1', name: 'Account Details', visibility: 'ALL', subItems: [
          { id: 'a', icon: 'pencil-outline', title: 'edit profile', route: '/app/profile/edit', path: 'profile-edit', visibility: 'ALL' },
          { id: 'b', icon: 'business-outline', title: 'business details', route: '/app/settings/business-details', path: 'business-details', visibility: AccountTypes.TAILOR },
          { id: 'c', icon: 'card-outline', title: 'account details', route: '/app/settings/account-details', path: 'account-details', visibility: AccountTypes.TAILOR },
          { id: 'd', icon: 'albums-outline', title: 'pindder premium', route: '/app/settings/pindder-premium', path: 'pindder-premium', visibility: AccountTypes.TAILOR },
        ]
      },
      { id: '2', name: 'Support', visibility: 'ALL', subItems: [
          { id: 'a', icon: 'help-buoy-outline', title: 'help center', route: '/help', path: 'help' },
          { id: 'b', icon: 'headset-outline', title: 'get in touch', route: '/get-in-touch', path: 'get-in-touch' },
        ]
      },
      { id: '3', name: 'Legal', visibility: 'ALL', subItems: [
          { id: 'a', icon: 'shield-checkmark-outline', title: 'usage policy', route: '/privacy-policy', path: 'business-details' },
          { id: 'b', icon: 'document-text-outline', title: 'terms of use', route: '/terms-and-condition', path: 'account-details' },
        ]
      },
      { id: '4', name: 'Manage Profile', color: 'danger', visibility: 'ALL', subItems: [
          { id: 'a', icon: 'trash-outline', title: 'delete account', action: 'delete', callback: () => this.deleteAccount() },
          { id: 'b', icon: 'log-out-outline', title: 'logout', action: 'logout', callback: () => this.presentLogoutConfirmationAlert() },
        ]
      },
    ]

    this.cdr.markForCheck();
  }

  async openExternalWebpage(url: string) {
    console.log('opening browser');
    await Browser.open({ 
      url: url, 
      toolbarColor: '#F1641D',         // Sets the header/toolbar background color
      presentationStyle: 'fullscreen',
    });
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

  deleteAccount() {
    return;
  }

  dispatchAction($event: any) {
    $event();
  }

  logout() {
    this.tokenService.clearToken();
    //this.sseService.disconnectAllEventSources();
    this.router.navigate(["auth"]);
  }
}
