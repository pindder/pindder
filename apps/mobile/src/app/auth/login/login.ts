import { Component, OnInit } from '@angular/core';
import { IonInput,
 } from "@ionic/angular";
import { FormsModule } from '@angular/forms';
import { ILogin } from '@pindder/contracts';

@Component({
  selector: 'app-login',
  imports: [
    IonInput,
    FormsModule,
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  public loginData!: ILogin;
  
  ngOnInit(): void {
    this.loginData = {
      email: '',
      password: ''
    };
  }
}
