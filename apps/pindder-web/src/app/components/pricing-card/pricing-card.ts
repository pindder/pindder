import { Component, inject, Input, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular";
import { DataTypes, IPlan } from '@pindder/contracts';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { AppService } from '../../services/app.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-pricing-card',
  imports: [IonIcon, NgClass, RouterLink],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.css',
})
export class PricingCard implements OnInit{
  @Input() plan!: IPlan;

  private appService = inject(AppService);
  private tokenService = inject(TokenService);

  isAuthenticated!: boolean;

  async ngOnInit() {
    this.isAuthenticated = await this.tokenService.isAuthenticated();
  }

  async initSub(plan_id: string) {
    console.log("This is native platform:::", Capacitor.isNativePlatform());
    if(Capacitor.isNativePlatform()) {
      return;
    } else {
      this.createCheckoutSession(plan_id);
    }
  }

  async createCheckoutSession(plan_id: string) {
    const res: any = await this.appService.stripeCheckoutSession(DataTypes.SUBSCRIPTION, plan_id);

    // console.log(res);
    if (res && res.url) {
      console.log(res)
      window.location.href = res.url;
    }
  }
}
