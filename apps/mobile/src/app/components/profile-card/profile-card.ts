import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonAvatar, IonBadge, IonLabel, IonIcon, IonItem, IonButton } from "@ionic/angular";
import { IProfile } from '@pindder/contracts';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile-card',
  imports: [IonIcon, IonBadge, IonAvatar, IonLabel, IonItem, IonButton],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard implements OnInit{
  @Input() profile!: IProfile;
  @Input() hideNotification = true;
  @Input() showBadge = true;
  @Output() action = new EventEmitter();

  private router = inject(Router);
  private notificationService = inject(NotificationService);

  totalUnread = this.notificationService.totalUnreadNotifications;

  launchProfile() {
    this.router.navigate(['app/profile/edit']);
  }

  ngOnInit(): void {
    console.log(this.showBadge);
  }
}
