import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonInput, IonItem, IonIcon, IonButton, IonContent, 
  IonSelect, IonSelectOption, IonText, 
  ToastController
} from "@ionic/angular";
import { countries, TailorReg } from '@pindder/contracts';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [
    IonSelect, IonSelectOption,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    FormsModule,
    IonItem,
    RouterLink,
    IonText
],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  registrationData!: TailorReg;
  countries = countries;
  isLoading = false;

  customModalOptions = {
    header: 'Select Country Code',
    breakpoints: [0, 0.75],
    initialBreakpoint: 0.5,
  };

  ngOnInit(): void {
    this.registrationData = {
      fullname: '',
      email: '',
      countryCode: countries[38].code,
      tel: '',
      gender: '',
      referralCode: ''
    };
  }

  onSignUp() {
    this.isLoading = !this.isLoading;

    console.log('Registering user:', this.registrationData);
    this.register();
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
