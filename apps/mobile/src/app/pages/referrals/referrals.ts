import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonBackButton, IonNote, IonButtons, IonCard, IonCardContent, 
  IonContent, IonHeader, IonIcon, IonText, IonTitle, IonToolbar, 
  IonGrid, IonRow, IonCol, IonLabel, IonItem, IonList, IonListHeader 
} from '@ionic/angular';
import { IProfile } from '@pindder/contracts';
import { TokenService } from '../../services/token.service';
import { PrimaryButton } from '../../components/primary-button/primary-button';

@Component({
  imports: [IonList, IonCol,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonCard, IonCardContent, IonCard,
    IonText, IonIcon,
    IonGrid,
    IonRow, IonLabel, IonItem, IonListHeader, PrimaryButton, IonNote,
    IonRow, IonLabel, IonItem, IonListHeader, PrimaryButton],
  templateUrl: './referrals.html',
  styleUrl: './referrals.css',
})
export class Referrals implements OnInit{
  private tokenService = inject(TokenService);
  private cdr = inject(ChangeDetectorRef);

  profile!: IProfile;

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profileStr = await this.tokenService.getProfile();
    
    if(profileStr){
      this.profile = JSON.parse(profileStr);
      console.log(this.profile);
    }
    
    this.cdr.markForCheck();
  }
}
