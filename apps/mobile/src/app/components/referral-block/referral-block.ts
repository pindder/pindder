import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonButton, IonLabel, IonCard, IonCardContent } from "@ionic/angular";
import { IProfile } from '@pindder/contracts';
import { environment } from '../../../environments/environment.production';

@Component({
  selector: 'app-referral-block',
  imports: [IonCard,
    IonLabel,
    IonButton,
    IonIcon, IonCardContent],
  templateUrl: './referral-block.html',
  styleUrl: './referral-block.css',
})
export class ReferralBlock implements OnInit{
  @Input() profile!: IProfile;
  @Output() action = new EventEmitter<string>();
  @Output() share = new EventEmitter<string>();
  
  appUrl = environment.appUri;
  catalogLink!: string; 

  ngOnInit(): void {
    // console.log(this.profile);
    this.catalogLink = `${environment.appUri}/catalogs/${this.profile.username}`;
  }
}
