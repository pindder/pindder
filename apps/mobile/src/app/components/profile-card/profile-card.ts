import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() hideNotification = true;
  @Output() action = new EventEmitter();

  private router = inject(Router);

  launchProfile() {
    this.router.navigate(['app/profile/edit']);
  }
}
