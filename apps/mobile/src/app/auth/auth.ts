import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonLabel, IonSegmentButton, IonSegment, IonIcon, IonItem, IonButton } from "@ionic/angular";
import { Login } from './login/login';
import { Register } from './register/register';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonContent,
    // Login,
    // Register,
    FormsModule,
    IonIcon,
    IonItem,
    IonButton
],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit{
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild(Login)
  loginComponent!: Login;

  @ViewChild(Register)
  registrationComponent!: Register; 

  authMode: 'signin' | 'signup' = 'signin';
  isSignUp = false;

  // Sign Up payload
  signupData = {
    fullName: '',
    email: '',
    phone: ''
  };

  // Sign In OTP flow states
  signinEmail = '';
  otpCode = '';
  otpSent = false;

  ngOnInit(): void {
    return
  }

  login() {
    //this.router.navigate(['auth/otp']);
    this.authService.loginBrand(this.loginComponent.loginData).subscribe({
      next: (val) => {
        if(val) {
          this.router.navigate(['auth/otp']);
        }
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  register() {
    //this.router.navigate(['auth/otp']);
    this.authService.registerTailor(this.registrationComponent.registrationData).subscribe({
      next: (val) => {
        //setTimeout(() => this.router.navigate(['auth/otp']), 3000);
        this.router.navigate(['auth/otp']);
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  requestLoginCode(action: string) {
    //console.log(action);
    if(action == 'sign_up') {
      this.register();
    } else {
      this.login();
    }
  }

  segmentChanged() {
    this.isSignUp = this.authMode === 'signup';
    // Reset OTP states when switching tabs
    this.otpSent = false;
    this.otpCode = '';
  }

  onSignUp() {
    console.log('Registering user:', this.signupData);
    // Connect to your NestJS backend signup endpoint
  }

  onSignInSubmit() {
    console.log(this.signinEmail);
    if (!this.otpSent) {
      // Step 1: Request OTP to be sent to email
      if (!this.signinEmail) return;
      console.log('Requesting OTP for:', this.signinEmail);
      
      // Call backend to trigger OTP email, then switch view state:
      this.otpSent = true;
    } else {
      // Step 2: Verify OTP code
      if (!this.otpCode || this.otpCode.length < 6) return;
      console.log('Verifying OTP code:', this.otpCode, 'for email:', this.signinEmail);
      
      // Call backend to verify OTP and exchange for access tokens
    }
  }

  resendOtp() {
    console.log('Resending OTP to:', this.signinEmail);
    // Trigger resend API call
  }
}
