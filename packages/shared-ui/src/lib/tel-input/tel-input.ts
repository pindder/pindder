import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonItem, IonIcon, 
    IonSelect, IonSelectOption, IonText, 
} from "@ionic/angular";
import { countries } from '@pindder/contracts';

@Component({
  selector: 'lib-tel-input',
  imports: [
    IonSelect, IonSelectOption,
    IonIcon,
    IonInput,
    FormsModule,
    IonItem,
    IonText,
    CommonModule
  ],
  templateUrl: './tel-input.html',
  styleUrl: './tel-input.css',
})
export class TelInput implements OnInit{
  @Input() countryCode!: string;
  @Input() tel!: string;
  @Input() icon?: boolean;
  @Output() updateCountryCode = new EventEmitter<string>();
  @Output() updateTel = new EventEmitter<string>();
  

  countries = countries;
  isLoading = false;

  customModalOptions = {
    header: 'Select Country Code',
    breakpoints: [0, 0.75],
    initialBreakpoint: 0.5,
  };

  ngOnInit(): void {
    if(this.icon) {
      this.icon = true;
    } else { this.icon = false }
  }
}