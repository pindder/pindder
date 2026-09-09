import { Component } from '@angular/core';
import { IonAvatar, IonBadge, IonLabel } from "@ionic/angular";

@Component({
  selector: 'app-profile-card',
  imports: [IonBadge, IonAvatar, IonLabel],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {}
