import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, 
  IonBackButton, IonSegmentButton, IonSegment, IonLabel, IonSegmentView,
  IonSegmentContent 
} from "@ionic/angular";

@Component({
  selector: 'app-orders',
  imports: [
    IonSegment,
    IonSegmentView,
    IonSegmentContent,
    IonSegmentButton,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonBackButton,
    IonLabel
],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {}
