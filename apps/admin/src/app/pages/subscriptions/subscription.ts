import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { IPlan, IResponse, SubscriptionStatus } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-subscription',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription implements OnInit{
  private subscriptionService = inject(SubscriptionService);
  private planService = inject(PlanService);
  private router = inject(Router);

  subscriptionStatuses = Object.keys(SubscriptionStatus);
  plans = signal<IPlan[]>([]);

  searchQuery = signal<string>('');
  selectedStatusFilter = signal<string>('all');
  selectedPlanFilter = signal<string>('All');
  timeRange = signal<'7d' | '30d' | '90d'>('30d');
  subscriptions = signal<any[]>([]);

  planFilterOptions: string[] = [];
  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }

  ngOnInit(): void {
    this.fetchSubscriptions();
  }

  fetchPlans() {
    this.planService.getPlans().subscribe({
      next: (response: IResponse<IPlan[]>) => {
        if(response.data) {
          this.plans.update(currentPlans => [
            ...currentPlans ?? [],
            ...response.data ?? []
          ]);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  fetchSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          this.subscriptions.update(subList => [
            ...subList ?? [],
            ...response.data ?? []
          ]);
          console.log('Subscription List:::', this.subscriptions());
          this.filteredSubscriptions();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  // Computed Filtered List
  filteredSubscriptions = computed(() => {
    let result = this.subscriptions();

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(s => 
        s.plan.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        s.plan.amount.includes(this.searchQuery().toLowerCase())
      );
    }

    const statusFilter = this.selectedStatusFilter();
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }

    const planFilter = this.selectedPlanFilter();
    if (planFilter !== 'All') {
      result = result.filter(t => t.subscription.plan.name === planFilter);
    }

    return result;
  });

  viewDetails(sub: any) {
    this.router.navigate(['app/tailors/', sub.tailor._id]);
  }

  navigateToPlan() {
    this.router.navigate(['app/plans']);
  }

  resetFilters() {
    this.searchQuery.set('');
  }
}
