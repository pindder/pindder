import { Component } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent } from "@ionic/angular";

@Component({
  selector: 'app-clients',
  imports: [IonContent, IonBackButton, IonButtons, IonToolbar, IonHeader, IonTitle],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {}
