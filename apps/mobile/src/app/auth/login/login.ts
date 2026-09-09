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
  private authService = inject(AuthService);

  public email:string = "";
  public password:string = "";

  ngOnInit(): void {
    
  }

  login() {
    console.log(this.email, this.password);
    this.authService.loginBrand({ email: this.email, password: this.password}).subscribe((val) => {
      console.log(val);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
