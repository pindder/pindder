import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonItem,
  IonLabel, 
  IonButton, 
  IonIcon,
  IonItemSliding,
  IonItemOptions, 
  IonItemOption 
} from "@ionic/angular";
import { DataTypes, INotification, IResponse, NotificationStatus } from '@pindder/contracts';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  private router = inject(Router);
  private notificationService = inject(NotificationService);

  notificationStatus = NotificationStatus;

  ngOnInit(): void {
    console.log(this.notification);  
  }

  viewNotification(notification: INotification) {
    this.notificationService.markAsRead(notification._id).subscribe({
      next: (response: IResponse<any>) => {
        console.log(response.msg);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
    
    switch(notification.type) {
      case DataTypes.ORDER:
        this.router.navigate(['app/orders/', notification.data._id ]);
        break;
      case DataTypes.CLIENT:
        this.router.navigate(['app/clients', notification.data._id ]);
        break;
      case DataTypes.DESIGN:
        this.router.navigate(['app/styles', notification.data._id ]);
        
    }
  }
}
