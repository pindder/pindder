import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-premium',
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent
  ],
  templateUrl: './premium.html',
  styleUrl: './premium.css',
})
export class Premium {}
