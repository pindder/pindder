import { Component, inject, OnInit } from '@angular/core';
import { IonContent, 
  IonInput, IonItem,
  IonButton, IonTitle,
  IonInputPasswordToggle,
} from "@ionic/angular";
import { SocialButtons } from '../../components/social-buttons/social-buttons';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ILogin } from '@pindder/contracts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    IonTitle, 
    IonInputPasswordToggle,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    SocialButtons,
    FormsModule
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  public loginData!: ILogin;
  
  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: ''
    };
  }

  login() {
    this.authService.loginBrand(this.loginData).subscribe((val) => {
      this.router.navigate(['app']);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
