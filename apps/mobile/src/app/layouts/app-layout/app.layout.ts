import { Component } from '@angular/core';
import { 
  IonTabButton, 
  IonTabs, 
  IonIcon, 
  IonLabel, 
  IonTabBar, 
} from '@ionic/angular';

@Component({
  selector: 'app-app.layout',
  imports: [
    IonIcon, 
    IonTabButton, 
    IonTabs, 
    IonLabel, 
    IonTabBar, 
  ],
  templateUrl: './app.layout.html',
  styleUrl: './app.layout.css',
})
export class AppLayout {}
