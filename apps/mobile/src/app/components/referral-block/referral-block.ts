import { Component } from '@angular/core';
import { IonIcon, IonButton, IonLabel, IonItem } from "@ionic/angular";

@Component({
  selector: 'app-referral-block',
  imports: [
    IonLabel,
    IonButton,
    IonIcon, IonItem],
  templateUrl: './referral-block.html',
  styleUrl: './referral-block.css',
})
export class ReferralBlock {}
