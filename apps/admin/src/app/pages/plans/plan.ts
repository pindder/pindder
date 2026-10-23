import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IOrderItem, IPlan, IResponse } from '@pindder/contracts';
import { PlanService } from '../../services/plan.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plan',
  imports: [FormsModule],
  templateUrl: './plan.html',
  styleUrl: './plan.css',
})
export class Plan implements OnInit{ 
  private planService = inject(PlanService);
  private router = inject(Router);

  orders = signal<IOrderItem[]>([]);
  packages = signal<IPlan[]>([]);
  currentView = signal<'payments' | 'packages' | 'orders'>('payments');
  statusTab = signal<'ALL' | 'Pending' | 'Completed' | 'Cancelled'>('ALL');
  searchQuery = signal<string>('');
  packageSearchQuery = signal<string>('');
  toastMessage = signal<string | null>(null);
  displayModal = signal<boolean>(false);
  features = signal<string | null>(null);
  package = signal<IPlan | null>({
    name: '',
    features: [],
    amount: 500,
    description: '',
    interval: '',
    recommended: false,
    free: false
  });

  ngOnInit(): void {
    this.fetchPlans();
  }

  fetchPlans() {
    this.planService.getPlans().subscribe({
      next: (response: IResponse<IPlan[]>) => {
        if(response.data) {
          this.packages.update(currentPlans => [
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

  filteredPackages = computed(() => {
    const query = this.packageSearchQuery().toLowerCase();

    return this.packages().filter(pkg => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(query) ||
        pkg.description?.toLowerCase().includes(query) ||
        pkg.features.forEach(f => f.toLowerCase().includes(query));

      return matchesSearch;
    });
  });

  viewPlan(plan_id: string) {
    this.router.navigate(['app/plans/', plan_id]);
  }

  updatePackageSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.packageSearchQuery.set(input.value);
  }

  assignPackageToOrder(pkg: IPlan) {
    this.triggerToast(`Selected package "${pkg.name}" ($${pkg.amount}) for new client order.`);
  }

  openModal(pkg?: IPlan) {
    if(this.packages().length < 1) {
      return this.createFreePlan()
    }
    
    if(pkg) {
      const featureList = [...pkg.features].join(', ');
      this.features.set(featureList);

      this.package.set({
        ...pkg,
      });
    }
    this.displayModal.set(true);
  }

  closeModal() {
    this.package.set(null);
    this.features.set(null);
    this.displayModal.set(false);
  }

  createFreePlan() {
    this.planService.createFreePlan().subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
            this.packages.update(currentPackages => [
              ...(currentPackages ?? []),
              response.data!
            ]);  
          }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  submitPlan() {
    if(!this.features()) {
      return this.triggerToast('Please you must provide at least 2 features');
    }

    const featureList: any = this.features()?.split(',');
    this.package.update(pkg => pkg ? {...pkg, features: featureList} : null);

    if(this.package() !== null) {
      this.planService.createPlan(this.package()!).subscribe({
        next: (response: IResponse<IPlan>) => {
          if(response.data) {
            this.packages.update(currentPackages => [
              ...(currentPackages ?? []),
              response.data!
            ]);  
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
    }
  }

  triggerToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
