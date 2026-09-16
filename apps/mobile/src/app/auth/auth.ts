import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonLabel, IonCard, IonButton, IonSegmentButton, 
  IonSegment, IonSegmentView, IonSegmentContent } from "@ionic/angular";
import { Login } from './login/login';
import { Register } from './register/register';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  imports: [
    IonButton, 
    IonSegmentContent,
    IonSegmentView,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonLabel,
    IonContent,
    Login,
    Register
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

  ngOnInit(): void {}

  login() {
    //this.router.navigate(['auth/otp']);
    this.authService.loginBrand(this.loginComponent.loginData).subscribe({
      next: (val) => {
        this.router.navigate(['auth/otp']);
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
}
