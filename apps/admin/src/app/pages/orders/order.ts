import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IOrderItem, IOrderType, IResponse, OrderStatus, QuotationLog } from '@pindder/contracts';
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order',
  imports: [DecimalPipe, TitleCasePipe],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order implements OnInit{
  private router = inject(Router);
  private orderService = inject(OrderService);

  orderStatus = OrderStatus;
  orderStatuses = Object.keys(OrderStatus);
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }

  // Navigation State
  currentView = signal<'dashboard' | 'details'>('dashboard');

  // Search & Filter Signals
  searchQuery = signal<string>('');
  selectedStatusFilter = signal<string>('All');
  selectedTypeFilter = signal<string>('All');
  toastMessage = signal<string | null>(null);

  statusFilterOptions = this.orderStatuses;
  orders = signal<IOrderItem[]>([]);

  ngOnInit(): void {
    this.fetchOrders();    
    this.statusFilterOptions.unshift('All');
  }

  fetchOrders() {
    this.orderService.getOrders().subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          console.log(response.data);
          this.orders.update(currentOrders => [
            ...currentOrders ?? [],
            ...response.data ?? []
          ])
          this.filteredOrders();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  // KPI Statistics Computation
  stats = computed(() => {
    const all = this.orders();
    return {
      total: all.length,
      ongoing: all.filter(o => o.status === OrderStatus.ONGOING).length,
      completed: all.filter(o => o.status === OrderStatus.COMPLETED).length,
      overdue: all.filter(o => o.status === OrderStatus.OVERDUE).length,
      pending: all.filter(o => o.status === OrderStatus.PENDING).length,
      cancelled: all.filter(o => o.status === OrderStatus.CANCELLED).length,
      //revenue: all.reduce((acc, o) => acc + o.payment.finalAgreedAmount, 0)
    };
  });

  // Computed Filtered Orders List for Data Table
  filteredOrders = computed(() => {
    let result = this.orders();

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(o => 
        o.orderId.toLowerCase().includes(query) ||
        o.client?.firstname.toLowerCase().includes(query) ||
        o.tailor.fullname.toLowerCase().includes(query)
      );
    }

    const statusFilter = this.selectedStatusFilter();
    if (statusFilter !== 'All') {
      result = result.filter(o => o.status === statusFilter);
    }

    const typeFilter = this.selectedTypeFilter();
    if (typeFilter !== 'All') {
      result = result.filter(o => o.styles[0].type === typeFilter);
    }

    return result;
  });

  // View Navigation Helpers
  navigateToDetails(orderId: string) {
    this.router.navigate(['app/orders/', orderId]);
  }

  // Filter Handlers
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  setStatusFilter(status: string) {
    this.selectedStatusFilter.set(status);
  }

  setTypeFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatusFilter.set(select.value);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedStatusFilter.set('All');
  }

  // Visual Utility Helpers
  getStatusBadgeClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.ONGOING:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case OrderStatus.COMPLETED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case OrderStatus.OVERDUE:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case OrderStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case OrderStatus.CANCELLED:
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default: 
      return '';
    }
  }

  getStatusDotClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.ONGOING: return 'bg-blue-500';
      case OrderStatus.COMPLETED: return 'bg-emerald-500';
      case OrderStatus.OVERDUE: return 'bg-rose-500 animate-ping';
      case OrderStatus.PENDING: return 'bg-amber-500';
      case OrderStatus.CANCELLED: return 'bg-red-400';
      default: return '';
    }
  }

  getOrderTypeBadgeClass(type: IOrderType): string {
    switch (type) {
      case 'Bespoke':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Ready to Wear':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Mixed':
        return 'bg-orange-50 text-[#D44E0C] border-orange-200';
    }
  }

  getQuoteStatusClass(status: QuotationLog['status']): string {
    switch (status) {
      case 'Agreed': return 'text-emerald-600 font-bold';
      case 'Countered': return 'text-amber-600';
      case 'Rejected': return 'text-rose-600';
    }
  }

  getItemSummaryNames(order: IOrderItem): string {
    return order.styles.map(i => i.name).join(', ');
  }

  triggerToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
