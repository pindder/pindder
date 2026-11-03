import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonTabBar, IonLabel, IonTabButton, IonContent, IonTitle, 
  IonHeader, IonSplitPane, IonToolbar, IonMenu, IonRouterOutlet, IonList, IonItem, 
  MenuController 
} from "@ionic/angular";

@Component({
  selector: 'app-app-layout',
  imports: [IonItem, IonList, IonSplitPane, IonHeader, IonTitle, IonContent, IonTabBar,
    IonIcon, IonLabel, IonTabButton, IonToolbar, IonMenu, IonRouterOutlet,
    RouterLink
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {
  private menuCtrl = inject(MenuController);

  toggleMenu() {
    console.log('Toggling menu...');
    this.menuCtrl.toggle(); // Opens/closes the sidebar drawer on mobile
  }
}
