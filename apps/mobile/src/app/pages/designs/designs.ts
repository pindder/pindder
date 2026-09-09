import { Component } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent } from "@ionic/angular";

@Component({
  selector: 'app-designs',
  imports: [IonContent, IonBackButton, IonButtons, IonToolbar, IonHeader, IonTitle],
  templateUrl: './designs.html',
  styleUrl: './designs.css',
})
export class Designs {}
