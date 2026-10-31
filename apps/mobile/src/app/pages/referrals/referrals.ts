import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { IonBackButton, IonNote, IonButtons, IonCard, IonCardContent, 
  IonContent, IonHeader, IonIcon, IonText, IonTitle, IonToolbar, 
  IonGrid, IonRow, IonCol, IonLabel, IonItem, IonList, IonListHeader, 
  IonModal
} from '@ionic/angular';
import { IProfile, IResponse } from '@pindder/contracts';
import { TokenService } from '../../services/token.service';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { AppService } from '../../services/app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Share } from '@capacitor/share';
import { FormsModule } from '@angular/forms';
import { Payout } from '../../components/payout/payout';

@Component({
  imports: [IonModal, IonList, IonCol,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonCard, IonCardContent, IonCard, IonText, IonIcon,
    IonGrid, IonRow, IonLabel, IonItem, IonListHeader, PrimaryButton,
    IonNote, FormsModule, Payout],
  templateUrl: './referrals.html',
  styleUrl: './referrals.css',
})
export class Referrals implements OnInit{
  private tokenService = inject(TokenService);
  private appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);
  
  profile!: IProfile;
  // Signal to track if sharing is supported
  isSharingSupported = signal<boolean>(false);

  async ngOnInit() {
    this.loadProfile();
    this.fetchReferrals();

    try {
      // Check if the current platform/browser supports sharing
      const result = await Share.canShare();
      this.isSharingSupported.set(result.value);
    } catch (error) {
      console.error('Error checking share capability:', error);
      this.isSharingSupported.set(false);
    }
  }

  fetchReferrals() {
    this.appService.getReferrals().subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          console.log(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  async shareLink() {
    if (!this.isSharingSupported()) return;

    try {
      await Share.share({
        title: 'Check out pindder!',
        text: 'Hey, kindly use my referral link to sign up on pindder.',
        url: `https://pindder.com?referral_code=${this.profile.referralCode}`, // The link you want to share
        dialogTitle: 'Share pindder with friends', // Android only title for the popup
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  async loadProfile() {
    const profileStr = await this.tokenService.getProfile();
    
    if(profileStr){
      this.profile = JSON.parse(profileStr);
      console.log(this.profile);
    }
    
    this.cdr.markForCheck();
  }

  dismissModal() {
    return;
  }
}
