import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  IonInput,
  // IonSelect,
  // IonSelectOption
} from "@ionic/angular";
import { TailorReg } from '@pindder/contracts';

@Component({
  selector: 'app-register',
  imports: [
    // IonSelect,
    // IonSelectOption,
    IonInput,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{
  registrationData!: TailorReg;

  ngOnInit(): void {
    this.registrationData = {
      fullname: '',
      email: '',
      phoneNo: '',
      gender: '',
      referralCode: ''
    };
  }
}
