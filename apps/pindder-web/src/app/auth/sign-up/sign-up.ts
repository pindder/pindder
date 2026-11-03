import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Registration } from '@pindder/shared-ui';
import { countries } from '@pindder/contracts';

@Component({
  selector: 'app-sign-up',
  imports: [Registration],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  countries = countries;

  public registrationData = {
    fullname: '',
    email: '',
    countryCode: countries[38].code,
    tel: '',
    gender: '',
    referralCode: ''
  };

  public isLoading = false;

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

  toLogin() {
    this.router.navigate(['auth/login']);
  }

  register() {
    this.authService.registerTailor(this.registrationData).subscribe({
      next: (val) => {
        if(val) {
          this.router.navigate(['auth/otp']);
        }
        this.isLoading = false;
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.error.message, 'danger', 'bottom');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
