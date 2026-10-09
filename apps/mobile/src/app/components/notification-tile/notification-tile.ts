import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { 
  IonItem,
  IonLabel, 
  IonButton, 
  IonIcon,
  IonItemSliding,
  IonItemOptions, 
  IonItemOption 
} from "@ionic/angular";
import { INotification, NotificationStatus } from '@pindder/contracts';

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
  @Input() notification!: INotification;
  @Output() action = new EventEmitter();

  notificationStatus = NotificationStatus;

  ngOnInit(): void {
    console.log(this.notification);  
  }
}
