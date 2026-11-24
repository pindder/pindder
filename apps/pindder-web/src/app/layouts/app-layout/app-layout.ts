import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonTabBar, IonLabel, IonTabButton, IonContent, IonTitle, 
  IonHeader, IonSplitPane, IonToolbar, IonMenu, IonRouterOutlet, IonList, IonItem, 
  MenuController 
} from "@ionic/angular";
import { TokenService } from '../../services/token.service';
import { AccountTypes, IProfile, SettingItem } from '@pindder/contracts';

@Component({
  selector: 'app-app-layout',
  imports: [IonItem, IonList, IonSplitPane, IonHeader, IonTitle, IonContent, IonTabBar,
    IonIcon, IonLabel, IonTabButton, IonToolbar, IonMenu, IonRouterOutlet,
    RouterLink
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout implements OnInit{
  private menuCtrl = inject(MenuController);
  private tokenService = inject(TokenService);
  private cdr = inject(ChangeDetectorRef);

  account!: IProfile;
  menuItems!: SettingItem[];

  async ngOnInit() {
    const profile = await this.tokenService.getProfile();

    if(profile) {
      this.account = JSON.parse(profile);
    }

    this.menuItems = [
        { id: '1', icon: 'grid-outline', title: 'Home', route: '/app/dashboard', path: 'dashboard', visibility: 'ALL' },
        { id: '2', icon: 'layers-outline', title: 'Dimension', route: '/app/measurements', path: 'measurements', visibility: AccountTypes.USER },
        { id: '3', icon: 'storefront-outline', title: 'Brands', route: '/app/brands', path: 'brands', visibility: AccountTypes.USER },
        { id: '4', icon: 'bag-handle-outline', title: 'Orders', route: '/app/orders', path: 'orders', visibility: 'ALL' },
        { id: '5', icon: 'people-outline', title: 'Clients', route: '/app/clients', path: 'clients', visibility: AccountTypes.TAILOR },
        { id: '6', icon: 'color-palette-outline', title: 'Styles', route: '/app/styles', path: 'styles', visibility: AccountTypes.TAILOR },
        { id: '7', icon: 'person-outline', title: 'Profile', route: '/app/settings', path: 'profile', visibility: 'ALL' },
    ];

    this.cdr.markForCheck();
  }

  toggleMenu() {
    console.log('Toggling menu...');
    this.menuCtrl.toggle(); // Opens/closes the sidebar drawer on mobile
  }
}
