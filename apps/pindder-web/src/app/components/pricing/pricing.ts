import { Component, inject, OnInit, signal } from '@angular/core';
import { IPlan } from '@pindder/contracts';
import { PlanService } from '../../services/plan.service';
import { PricingCard } from '../pricing-card/pricing-card';

@Component({
  selector: 'app-pricing',
  imports: [PricingCard],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {
  plans = signal<IPlan[]>([]);
  planService = inject(PlanService);

  ngOnInit(): void {  
    if(this.planService.isLoaded()) {
      this.plans.set(this.planService.plans());
    } else {
      this.fetchPlans();
    }
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
}
