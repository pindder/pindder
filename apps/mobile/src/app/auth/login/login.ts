import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonInput, IonItem, IonContent, IonIcon, IonButton, IonSpinner, ToastController } from "@ionic/angular";
import { FormsModule } from '@angular/forms';
import { ILogin } from '@pindder/contracts';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [IonIcon, IonContent, 
    IonInput,
    FormsModule,
    IonItem,
    IonButton,
    RouterLink,
    IonSpinner
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);
  
  public loginData!: ILogin;
  showPassword = false;
  isLoading = false;
  
  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: ''
    };
  }

  login() {
    this.isLoading = !this.isLoading;
    this.authService.loginBrand(this.loginData).subscribe({
      next: (val) => {
        if(val) {
          this.isLoading = false;
          this.router.navigate(['auth/otp']);
        }
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.isLoading = false;
        this.presentToast(error.error.message, 'danger', 'bottom');
        this.cdr.markForCheck();
      }
    });
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  // togglePassword() {
  //   return;
  // }
}
