import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonAvatar, IonBadge, IonLabel, IonIcon, IonItem, IonButton } from "@ionic/angular";
import { IProfile } from '@pindder/contracts';

@Component({
  selector: 'app-profile-card',
  imports: [IonIcon, IonBadge, IonAvatar, IonLabel, IonItem, IonButton],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {
  @Input() profile!: IProfile;
  @Input() hideNotification: boolean = true;
  @Output() action = new EventEmitter();
}
