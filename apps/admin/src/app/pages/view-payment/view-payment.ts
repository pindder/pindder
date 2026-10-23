import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { IPayment, IResponse, Order } from '@pindder/contracts';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-view-payment',
  imports: [],
  templateUrl: './view-payment.html',
  styleUrl: './view-payment.css',
})
export class ViewPayment implements OnInit{
  private ar = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private location = inject(Location);

  payment = signal<IPayment | null>(null);
  toastMessage = signal<string | null>(null);
  selectedOrderSignal = signal<Order | null>(null);

  ngOnInit(): void {
    this.fetchPaymentDetails();  
  }

  fetchPaymentDetails() {
    const id = this.ar.snapshot.paramMap.get('id');

    if(!id) {
      return this.goBack();
    }

    this.paymentService.getPayment(id).subscribe({
      next: (response: IResponse<IPayment>) => {
        if(response.data) {
          this.payment.set(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  goBack() {
    this.location.back();
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
