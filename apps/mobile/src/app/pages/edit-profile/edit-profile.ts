import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonContent, IonHeader, IonTitle, IonToolbar,
  IonBackButton, IonInput,
  ViewWillEnter,
  ToastController,
  IonList,
  IonItem
} from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { IProfile, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { PrimaryButton } from '../../components/primary-button/primary-button';

const initialProfile: IProfile = {
  firstname: '',
  lastname: '',
  email: '',
  address: '',
  phoneNo: '',
  username: ''
};

@Component({
  selector: 'app-edit-profile',
  imports: [IonHeader, IonContent, FormsModule, IonToolbar,
    IonTitle, IonBackButton, IonButtons, IonList, IonInput,
    IonItem, PrimaryButton],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit, ViewWillEnter{
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);
  private toastCtrl = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  profile: IProfile = { ...initialProfile };

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  ngOnInit(): void { }

  async loadProfile() {
    const profileStr = await this.tokenService.getProfile();
    // Fall back to initialProfile instead of null to prevent template errors
    this.profile = profileStr ? JSON.parse(profileStr) : { ...initialProfile };
    this.cdr.markForCheck();
  }

  async presentToast(
    msg: string,
    position: 'top' | 'bottom' | 'middle' = 'top',
    color: 'danger' | 'primary' | 'light' | 'dark' | 'secondary' = 'light',
    icon?: string,
  ) {
    const toast = await this.toastCtrl.create({
      message: msg, // 👈 Assigned passed message
      icon: icon ?? '',
      color,
      position,
      duration: 2500, // 👈 Added auto-dismiss duration
    });
    
    await toast.present(); // 👈 Must call present() to show
  }

  submit() {
    if (!this.profile) return;

    this.profileService.updateProfile(this.profile).subscribe({
      next: (res: IResponse<any>) => {
        this.profile = res.data;
        // Keep TokenService local storage in sync with updated profile
        this.tokenService.setProfile(res.data);
        this.presentToast(res.msg || 'Profile updated successfully!', 'top', 'primary');
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        const errorMsg = error.error?.msg || error.message || 'An error occurred';
        this.presentToast(errorMsg, 'top', 'danger');
      },
    });
  }
}
