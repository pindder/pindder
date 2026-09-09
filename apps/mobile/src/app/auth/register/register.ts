import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, 
  IonToolbar, IonInput, 
  IonButton, IonText 
} from "@ionic/angular";
import { SocialButtons } from "../../components/social-buttons/social-buttons";

@Component({
  selector: 'app-register',
  imports: [
    IonText,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonInput,
    IonButton,
    SocialButtons
],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}
