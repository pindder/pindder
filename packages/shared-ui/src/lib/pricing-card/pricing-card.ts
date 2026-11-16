import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from "@ionic/angular";
import { IPlan } from '@pindder/contracts';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-pricing-card',
  imports: [IonIcon, NgClass, RouterLink],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.css',
})
export class PricingCard {
  @Input() isNative = false;
  @Input() plan!: IPlan;
  @Input() isAuthenticated!: boolean;
  @Output() initializeSubscription = new EventEmitter<string>();    
}
