import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountStatus, IPlan, IResponse, ITailor } from '@pindder/contracts';
import { TailorService } from '../../services/tailor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-tailor',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './tailor.html',
  styleUrl: './tailor.css',
})
export class Tailor implements OnInit{
  private router = inject(Router);
  private tailorService = inject(TailorService);
  private planService = inject(PlanService);
  private cdr = inject(ChangeDetectorRef);

  accountStatus = AccountStatus;
  accountStatuses = Object.keys(AccountStatus);
  plans = signal<IPlan[]>([]);
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }

  // Navigation & View Controls
  isDarkMode = signal<boolean>(true);
  currentView = signal<'list' | 'detail'>('list');

  // Search & Filter
  searchQuery = signal<string>('');
  selectedStatusFilter = signal<string>('All');
  selectedPlanFilter = signal<string>('All');
  tailors = signal<ITailor[]>([]);

  // Selected Tailor state
  selectedTailor = signal<ITailor | null>(null);

  ngOnInit(): void {
    this.fetchPlans();
    this.fetchTailors();
    this.accountStatuses.unshift('All');
  }

  // Filter Handlers
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
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

  fetchTailors() {
    this.tailorService.getTailors().subscribe({
      next: (response: IResponse<ITailor[]>) => {
        if(response.data && response.data.length > 0) {
          this.tailors.update(existingTailors => [
            ...existingTailors ?? [], // Safe fallback
            ...response.data ?? []   // Safe fallback
          ]);
        }
        
        this.filteredTailors();
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  // Computed Filtered List
  filteredTailors = computed(() => {
    let result = this.tailors();

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(t => 
        t.fullname.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        //t.studioName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    const statusFilter = this.selectedStatusFilter();
    if (statusFilter !== 'All') {
      result = result.filter(o => o.status === statusFilter);
    }

    const planFilter = this.selectedPlanFilter();
    if (planFilter !== 'All') {
      result = result.filter(t => t.subscription.plan.name === planFilter);
    }

    return result;
  });

  setAccountStatusFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatusFilter.set(select.value);
  }

  setPlanFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedPlanFilter.set(select.value);
  }

  toggleTheme() {
    this.isDarkMode.update((val) => !val);
  }

  viewTailorDetails(tailor: ITailor) {
    this.selectedTailor.set(tailor);
    this.currentView.set('detail');
    this.router.navigate(['app/tailors/', tailor._id]);
  }

  resetFilters() {
    this.searchQuery.set('');
  }
}
