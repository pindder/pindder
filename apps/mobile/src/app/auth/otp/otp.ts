import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInputOtp, 
  IonBackButton, IonToolbar, IonButtons, IonTitle, 
  IonLabel 
} from '@ionic/angular';
import { IVerification } from '@pindder/contracts';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Component({
  imports: [
    IonButton, 
    IonTitle, 
    IonContent, 
    IonHeader, 
    IonInputOtp, 
    IonButtons, 
    IonBackButton, 
    IonToolbar, 
    IonButtons, 
    IonTitle, 
    IonLabel,
    FormsModule
  ],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);

  verificationData!: IVerification;
  
  ngOnInit(): void {
    this.verificationData = {
      code: ''
    };
  }

  async verifyOtp() {
    this.authService.verifyCode(this.verificationData).subscribe((val) => {
      this.router.navigate(['app'])
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  async resendOtp() {
    const { value } = await Preferences.get({
      key: 'email',
    });

    if(value) {
      this.authService.resendCode(value).subscribe((val) => {
        console.log(val);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      })
    }
  }
}
