import { Component, Input, OnInit } from '@angular/core';
import { 
  IonItem,
  IonLabel, 
  IonButton, 
  IonIcon,
  IonItemSliding,
  IonItemOptions, 
  IonItemOption 
} from "@ionic/angular";

@Component({
  selector: 'app-notification-tile',
  imports: [
    IonItemOption, 
    IonItemOptions,
    IonItemSliding, 
    IonIcon, 
    IonButton, 
    IonItem,
    IonLabel,
  ],
  templateUrl: './notification-tile.html',
  styleUrl: './notification-tile.css',
})
export class NotificationTile implements OnInit{
  @Input() notification!: any;

  ngOnInit(): void {
    console.log(this.notification);  
  }
}
