import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonItem, IonIcon, IonButton, IonContent, 
  IonSelect, IonSelectOption, IonText, 
} from "@ionic/angular";
import { countries, TailorReg } from '@pindder/contracts';

@Component({
  selector: 'lib-registration',
  imports: [
    IonSelect, IonSelectOption,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    FormsModule,
    IonItem,
    IonText,
    CommonModule
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit{
  @Input() registrationData!: TailorReg;
  @Output() register = new EventEmitter<void>();
  @Output() goToLogin = new EventEmitter<void>();

  countries = countries;
  isLoading = false;

  customModalOptions = {
    header: 'Select Country Code',
    breakpoints: [0, 0.75],
    initialBreakpoint: 0.5,
  };

  ngOnInit(): void {
    return;  
  }

  onSignUp() {
    this.isLoading = !this.isLoading;

    console.log('Registering user:', this.registrationData);
    //this.register();
  }
}