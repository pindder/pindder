import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToggle, IonToolbar, IonBackButton, IonButtons, IonListHeader, ViewWillEnter } from '@ionic/angular';
import { ProfileCard } from "../../components/profile-card/profile-card";
import { TokenService } from '../../services/token.service';
import { IProfile } from '@pindder/contracts';

const initialProfile: IProfile = {
  firstname: '',
  lastname: '',
  email: '',
  address: '',
  phoneNo: '',
  username: ''
};

@Component({
  selector: 'app-settings',
  imports: [
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonItem,
    IonList,
    IonToggle,
    IonLabel,
    IonBackButton,
    IonButtons,
    ProfileCard,
    RouterLink,
    IonListHeader,
    ProfileCard
],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements ViewWillEnter{
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private cdr = inject(ChangeDetectorRef);

  profile: IProfile = { ...initialProfile };

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profileStr = await this.tokenService.getProfile();
    // Fall back to initialProfile instead of null to prevent template errors
    this.profile = profileStr ? JSON.parse(profileStr) : { ...initialProfile };
    this.cdr.markForCheck();
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(["auth"]);
  }
}
