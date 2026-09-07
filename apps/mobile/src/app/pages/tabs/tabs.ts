import { Component } from '@angular/core';
import { 
  IonTabButton, 
  IonTabs, 
  IonIcon, 
  IonLabel, 
  IonTabBar, 
} from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  imports: [
    IonIcon, 
    IonTabButton, 
    IonTabs, 
    IonLabel, 
    IonTabBar, 
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  
}
