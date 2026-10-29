import { Component } from '@angular/core';
import { IonToolbar, IonHeader, IonTitle, IonBackButton, IonButtons, IonContent, IonIcon, IonLabel, IonItem, IonList } from "@ionic/angular";

@Component({
  selector: 'app-contact',
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonIcon, IonList,
    IonLabel, IonItem
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
