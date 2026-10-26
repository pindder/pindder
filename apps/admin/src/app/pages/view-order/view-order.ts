import { DatePipe, DecimalPipe, Location, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { IAdminOrder, IOrderItem, IOrderType, IResponse, OrderStatus, OrderStatuses, QuotationLog } from '@pindder/contracts';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-view-order',
  imports: [DecimalPipe, DatePipe, TitleCasePipe],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css',
})
export class ViewOrder implements OnInit{
  private location = inject(Location);
  private orderService = inject(OrderService);
  private ar = inject(ActivatedRoute);

  toastMessage = signal<string | null>(null);
  order = signal<IOrderItem | null>(null);

  orderStatuses = OrderStatus;

  // Workflow Stages Reference
  workflowStages = [
    { name: 'Quotation Agreed', description: 'Specs & Price approved' },
    { name: 'Fabrics Sourced', description: 'Materials in shop' },
    { name: 'Pattern Cutting', description: 'Precision cuts' },
    { name: 'Stitching', description: 'Assembly phase' },
    { name: 'Fitting & Quality', description: 'Client verification' },
    { name: 'Delivered', description: 'Dispatched to client' },
  ];

  ngOnInit(): void {
    this.fetchOrders();    
  }

  fetchOrders() {
    const id = this.ar.snapshot.paramMap.get('id');

    if(!id) {
      return this.location.back();
    }

    this.orderService.getOrder(id).subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          console.log(response.data);
          this.order.set(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  navigateToDashboard() {
    this.location.back();
  }

  // Order Status Mutations
  updateOrderStatus(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as OrderStatuses;
    
    //this.order.update((o: any) => { ...this.order(), status: newStatus });

    this.triggerToast(`Order #${this.order()?._id} status updated to ${newStatus}`);
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
        return 'bg-red-100 text-red-500 border-red-500';
      default: 
      return '';
    }
  }

  reassignTailorModal() {
    const currentTailor = this.order()?.tailor.fullname;
    const newTailorName = currentTailor === 'Emmanuel Vance' ? 'Aisha Bello' : 'Emmanuel Vance';
    
    // Safely update the single order signal immutably
    this.order.update((currentOrder: any) => {
      if (!currentOrder) return null;
      return {
        ...currentOrder,
        tailor: {
          ...currentOrder.tailor,
          name: newTailorName
        }
      };
    });

    this.triggerToast(`Reassigned Order #${this.order()?._id} to ${newTailorName}`);
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

  getItemSummaryNames(order: IAdminOrder): string {
    return order.items.map(i => i.name).join(', ');
  }

  getStageIndex(order: IOrderItem): number {
    switch (order.status) {
      case OrderStatus.PENDING: return 0;
      case OrderStatus.ONGOING: return 3;
      case OrderStatus.COMPLETED: return 5;
      case OrderStatus.OVERDUE: return 3;
      case OrderStatus.CANCELLED: return -1;
      default: return 0
    }
  }

  // getItemProgressPercent(item: IOrderItem): number {
  //   const percent = Math.round((item.spentDays / item.estimatedDays) * 100);
  //   return Math.min(percent, 100);
  // }

  // getItemDurationProgressColor(item: IOrderItem): string {
  //   if (item.spentDays > item.estimatedDays) {
  //     return 'bg-rose-500';
  //   }
  //   if (item.spentDays === item.estimatedDays) {
  //     return 'bg-emerald-500';
  //   }
  //   return 'bg-[#F1641D]';
  // }

  triggerToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
