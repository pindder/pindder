import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonInput, IonItem, IonContent, IonIcon, IonButton, IonSpinner, ToastController } from "@ionic/angular";
import { FormsModule } from '@angular/forms';
import { ILogin } from '@pindder/contracts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-login',
  imports: [IonContent, IonButton, IonIcon, IonInput, IonItem, FormsModule, IonSpinner, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  @Input() loginData!: ILogin;
  @Input() isLoading!: boolean;
  @Output() login = new EventEmitter<ILogin>();
  @Output() goToRegister = new EventEmitter<void>();

  private toastController = inject(ToastController);

  // showPassword = false; 
  
  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: ''
    };
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
