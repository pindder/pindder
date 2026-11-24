import { Component, inject, OnInit, signal } from '@angular/core';
import { DataTypes, IPlan } from '@pindder/contracts';
import { PlanService } from '../../services/plan.service';
import { AppService } from '../../services/app.service';
import { TokenService } from '../../services/token.service';
import { Capacitor } from '@capacitor/core';
import { PricingCard } from '@pindder/shared-ui';

@Component({
  selector: 'app-pricing',
  imports: [PricingCard],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {
  private appService = inject(AppService);
  private tokenService = inject(TokenService);
  private planService = inject(PlanService);
  
  isAuthenticated!: boolean;
  plans = signal<IPlan[]>([]);

  async ngOnInit() {  
    if(this.planService.isLoaded()) {
      this.plans.set(this.planService.plans());
    } else {
      this.fetchPlans();
    }
    this.isAuthenticated = await this.tokenService.isAuthenticated();
  }

  fetchPlans() {
    this.planService.fetchPlans().subscribe({
      next: (response) => {
        if(response.data) {
          this.plans.set(response.data);
          this.planService.isLoaded.set(true);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
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
