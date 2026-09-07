import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular";

@Component({
  selector: 'app-orders',
  imports: [
    IonTitle, 
    IonHeader,
    IonToolbar,
    IonContent,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {}
