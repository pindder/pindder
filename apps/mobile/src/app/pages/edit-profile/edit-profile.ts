import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar,
  IonBackButton,
  ViewWillEnter,
  ToastController,
  IonList,
  IonItem
} from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { IProfile, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-edit-profile',
  imports: [IonHeader, IonContent, FormsModule, IonToolbar,
    IonTitle, IonBackButton, IonButton, IonButtons, IonList,
    IonItem,  
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit, ViewWillEnter{
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);
  private toastCtrl = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  profile!: IProfile;

  ionViewWillEnter(): void {
    
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profile = await this.tokenService.getProfile();
    this.profile = profile ? JSON.parse(profile) : null;
    this.cdr.markForCheck();
  }

  presentToast(
    msg: string,
    position?: 'top' | 'bottom' | 'middle',
    color?: 'danger' | 'primary' | 'light' | 'dark' | 'secondary',
    icon?: string,
  ) {
    this.toastCtrl.create({
      message: '',
      icon: icon ?? '',
      color: color ?? 'light',
      position: position ?? 'top'
    });
  }

  submit() {
    this.profileService.updateProfile(this.profile).subscribe({
      next: (res: IResponse<any>) => {
        this.profile = res.data;
        this.presentToast(res.msg, 'top', 'primary');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'top', 'danger');
      }
    })
  }
}
