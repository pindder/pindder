import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILogin, IResponse } from '@pindder/contracts';
import { Login } from '@pindder/shared-ui';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  imports: [Login],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit, ViewWillEnter {
  public loginData!: ILogin;
  private router = inject(Router);
  private authService = inject(AuthService);
  private ar = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  acctType!: string

  ionViewWillEnter(): void {
    const acctType = this.ar.snapshot.queryParamMap.get('type');

    if(acctType) {
      this.acctType = acctType;
    }
  }

  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: ''
    };
  }

  toRegister() {
    this.router.navigate(['auth/register']);
  }

  submit($event: ILogin) {
    this.loginData = $event; // Update the loginData with the emitted value
    // console.log('Login submitted with data:', this.loginData);
    
    this.isLoading.set(true);

    if(this.acctType) {
      this.authService.loginUser(this.loginData).subscribe({
        next: (val: IResponse<any>) => {
          this.router.navigate(['auth/verify-otp']);
          this.isLoading.set(false);
        }, 
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.isLoading.set(false);
        }
      })
    } else {
      this.authService.loginTailor(this.loginData).subscribe({
        next: (val: IResponse<any>) => {
          this.router.navigate(['auth/verify-otp']);
          this.isLoading.set(false);
        }, 
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.isLoading.set(false);
        }
      });
    }
  }
}
