import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse, ITailor } from '@pindder/contracts';
import { TailorService } from '../../services/tailor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tailor',
  imports: [FormsModule],
  templateUrl: './tailor.html',
  styleUrl: './tailor.css',
})
export class Tailor implements OnInit{
  private router = inject(Router);
  private tailorService = inject(TailorService);
  private cdr = inject(ChangeDetectorRef);

  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }

  // Navigation & View Controls
  isDarkMode = signal<boolean>(true);
  currentView = signal<'list' | 'detail'>('list');

  // Search & Filter
  searchQuery = '';
  selectedStatusFilter = 'all';
  selectedPlanFilter = 'all';
  tailors = signal<ITailor[]>([]);

  // Selected Tailor state
  selectedTailor = signal<ITailor | null>(null);

  ngOnInit(): void {
    this.fetchTailors();
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
        
        console.log(this.tailors());
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  // Computed Filtered List
  filteredTailors = computed(() => {
    return this.tailors().filter((t) => {
      const matchesSearch = t.fullname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            //t.studioName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            t.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.selectedStatusFilter === 'all' || t.status === this.selectedStatusFilter;
      const matchesPlan = this.selectedPlanFilter === 'all' || t.subscription.plan === this.selectedPlanFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  });

  toggleTheme() {
    this.isDarkMode.update((val) => !val);
  }

  viewTailorDetails(tailor: ITailor) {
    this.selectedTailor.set(tailor);
    this.currentView.set('detail');
    this.router.navigate(['app/tailors/', tailor._id]);
  }
}
