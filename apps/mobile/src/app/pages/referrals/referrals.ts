import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-referrals',
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent
   ],
  templateUrl: './referrals.html',
  styleUrl: './referrals.css',
})
export class Referrals {}
