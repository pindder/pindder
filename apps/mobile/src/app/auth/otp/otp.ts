import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInputOtp, 
  IonBackButton, IonToolbar, IonButtons, IonTitle, 
  IonLabel 
} from '@ionic/angular';
import { IVerification } from '@pindder/contracts';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

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
  private tokenService = inject(TokenService);
  private router = inject(Router);

  verificationData!: IVerification;
  
  ngOnInit(): void {
    this.verificationData = {
      code: ''
    };
  }

  async verifyOtp() {
    console.log(this.verificationData);
    this.authService.verifyCode(this.verificationData).subscribe({
      next: (data) => {
        console.log(data);
        this.tokenService.setPreferenceValue('account', JSON.stringify(data.account));
        this.router.navigate(['app'])
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  async resendOtp() {
    let value = await this.tokenService.getPreferenceValue('email');

    if(value) {
      this.authService.resendCode(value).subscribe({
        next: (val) => {
          console.log(val);
        }, 
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
    }
  }
}
