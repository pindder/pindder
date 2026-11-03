import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AccountTypes, IVerification } from '@pindder/contracts';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { Otp as VerifyOtp } from '@pindder/shared-ui';

@Component({
  selector: 'app-otp',
  imports: [VerifyOtp],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp implements OnInit {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  verificationData!: IVerification;
  acctType = AccountTypes.TAILOR;

  ngOnInit(): void {
    this.verificationData = {
      code: ''
    };
  }

  async verifyOtp() {
    console.log(this.verificationData);
    this.authService.verifyCode(this.verificationData).subscribe({
      next: (data) => {
        this.tokenService.setPreferenceValue('account', JSON.stringify(data.account));
        this.router.navigate(['app/dashboard']);
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  async resendOtp() {
    const value = await this.tokenService.getPreferenceValue('email');
    
    if(value) {
      this.authService.resendCode(value, this.acctType).subscribe({
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
