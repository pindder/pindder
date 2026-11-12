import { Component, inject, OnInit } from '@angular/core';
import { AlertController, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/angular';
import { SettingsSection } from '@pindder/contracts';
import { Settings as LibSettings } from '@pindder/shared-ui';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, LibSettings],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private alertCtrl = inject(AlertController);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  
  settingsItems!: SettingsSection[];

  ngOnInit(): void {
    this.settingsItems = [
      { id: '1', name: 'Account Details', subItems: [
          { id: 'a', icon: 'business-outline', title: 'business details', route: '/app/settings/business-details', path: 'business-details' },
          { id: 'b', icon: 'card-outline', title: 'account details', route: '/app/settings/account-details', path: 'account-details' },
          { id: 'c', icon: 'albums-outline', title: 'pindder premium', route: '/app/settings/pindder-premium', path: 'pindder-premium' },
        ]
      },
      { id: '2', name: 'Support', subItems: [
          { id: 'a', icon: 'help-buoy-outline', title: 'help center', route: '/help', path: 'help' },
          { id: 'b', icon: 'headset-outline', title: 'get in touch', route: '/get-in-touch', path: 'get-in-touch' },
        ]
      },
      { id: '3', name: 'Legal', subItems: [
          { id: 'a', icon: 'shield-checkmark-outline', title: 'usage policy', route: '/privacy-policy', path: 'business-details' },
          { id: 'b', icon: 'document-text-outline', title: 'terms of use', route: '/terms-and-condition', path: 'account-details' },
        ]
      },
      { id: '4', name: 'Manage Profile', color: 'danger', subItems: [
          { id: 'a', icon: 'trash-outline', title: 'delete account', action: 'delete', callback: () => this.deleteAccount() },
          { id: 'b', icon: 'log-out-outline', title: 'logout', action: 'logout', callback: () => this.logout() },
        ]
      },
    ]
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

  logout() {
    this.tokenService.clearToken();
    //this.sseService.disconnectAllEventSources();
    this.router.navigate(["auth"]);
  }
}
