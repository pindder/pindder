import { Component, Input } from '@angular/core';
import { IonIcon } from "@ionic/angular";
import { IPlan } from '@pindder/contracts';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing-card',
  imports: [IonIcon, NgClass, RouterLink],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.css',
})
export class PricingCard {
  @Input() plan!: IPlan;
}
