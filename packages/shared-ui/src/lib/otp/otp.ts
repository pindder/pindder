import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInputOtp, 
  IonBackButton, IonToolbar, IonButtons, IonLabel,
} from '@ionic/angular';
import { IVerification } from '@pindder/contracts';

@Component({
  selector: 'lib-otp',
  imports: [
    IonButton, 
    IonContent, 
    IonHeader, 
    IonInputOtp, 
    IonButtons, 
    IonBackButton, 
    IonToolbar, 
    IonButtons, 
    IonLabel,
    FormsModule
  ],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp {
  @Input() verificationData!: IVerification;
  @Output() verify = new EventEmitter<IVerification>();
  @Output() resendOtp = new EventEmitter();
}
