import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from "@ionic/angular";
import { IPlan } from '@pindder/contracts';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-pricing-card',
  imports: [IonIcon, NgClass, RouterLink, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.css',
})
export class PricingCard {
    @Input() plan!: IPlan;
    @Input() isAuthenticated!: boolean;
    @Output() initializeSubscription = new EventEmitter<string>();    
}
