import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonButton, IonLabel, IonCard, IonCardContent } from "@ionic/angular";

@Component({
  selector: 'app-referral-block',
  imports: [IonCard,
    IonLabel,
    IonButton,
    IonIcon, IonCardContent],
  templateUrl: './referral-block.html',
  styleUrl: './referral-block.css',
})
export class ReferralBlock {
  @Input() profile: any;
  @Output() action = new EventEmitter();
}
