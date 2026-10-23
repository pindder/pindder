import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { IPayment, IResponse, PaymentStatus } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit{
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  payments = signal<IPayment[]>([]);

  timeRange = signal<'7d' | '30d' | '90d'>('30d');
  currentView = signal<'payments' | 'orders'>('payments');
  statusTab = signal<'ALL' | 'PROCESSING' | 'SUCCESS' | 'ABANDONED'>('ALL');
  searchQuery = signal<string>('');
  toastMessage = signal<string | null>(null);

  Math = Math; // Utility for template Math references

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments() {
    this.paymentService.getPayments().subscribe({
      next: (response: IResponse<any[]>) => {
        if(response.data) {
          this.payments.update(currentPayments => [
            ...currentPayments ?? [],
            ...response.data ?? []
          ]);
          console.log(this.payments);
          console.log(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  navigateToPayment(payment_id: string) {
    this.router.navigate(['app/payments/', payment_id]);
  }

  filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const tab = this.statusTab();

    return this.payments().filter(payment => {
      const matchesSearch =
        payment._id?.toLowerCase().includes(query) ||
        payment.client?.fullname?.toLowerCase().includes(query) ||
        payment.tailor?.fullname.toLowerCase().includes(query) ||
        payment.responsePayload.reference.toLowerCase().includes(query);

      const matchesStatus = tab === 'ALL' || payment.status === tab;
      return matchesSearch && matchesStatus;
    });
  });

  metrics = computed(() => {
    const list = this.payments();
    const totalRevenueCollected = list.reduce((sum, p) => sum + p.amount!, 0);
    const totalPendingBalance = list.reduce((sum, p) => sum + (p.status === PaymentStatus.PROCESSING ? p.amount! : 0), 0);
    const completedPaymentsCount = list.filter(p => p.status === PaymentStatus.SUCCESS).length;
    const pendingPaymentsCount = list.filter(p => p.status === PaymentStatus.PROCESSING).length;
    const cancelledPaymentsCount = list.filter(p => p.status === PaymentStatus.ABANDONED).length;

    return {
      totalRevenueCollected,
      totalPendingBalance,
      completedPaymentsCount,
      pendingPaymentsCount,
      cancelledPaymentsCount,
      totalCount: list.length
    };
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }
  }

  downloadReceipt(orderId: string) {
    this.triggerToast(`Receipt for ${orderId} downloaded successfully.`);
  }

  triggerToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
