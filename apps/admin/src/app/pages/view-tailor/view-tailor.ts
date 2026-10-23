import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Payment, Referral, ITailor, IResponse } from '@pindder/contracts';
import { TailorService } from '../../services/tailor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-view-tailor',
  imports: [FormsModule, DatePipe],
  templateUrl: './view-tailor.html',
  styleUrl: './view-tailor.css',
})
export class ViewTailor implements OnInit{
  private tailorService = inject(TailorService);
  private location = inject(Location);
  private ar = inject(ActivatedRoute);

  activeTab = signal<'info' | 'clients' | 'orders' | 'payments' | 'referrals'>('info');
  tailor = signal<ITailor | null>(null);
  currentView = signal<'list' | 'detail'>('list');

  // Email Modal State
  showEmailModal = signal<boolean>(false);
  emailSubject = '';
  emailBody = '';

  mockPayments: Payment[] = [
    { id: 'TX-9021', clientName: 'Dr. Tunde Bakare', amount: '$450.00', method: 'Card', date: 'Oct 15, 2026', status: 'Completed' },
    { id: 'TX-9022', clientName: 'Nneka Okeke', amount: '$160.00', method: 'Bank Transfer', date: 'Oct 10, 2026', status: 'Completed' },
  ];

  mockReferrals: Referral[] = [
    { id: 'REF-01', tailorName: 'Grace Danjuma Studio', joinedDate: 'May 14, 2026', commissionEarned: '$150.00', status: 'Active' },
    { id: 'REF-02', tailorName: 'David Ojo Couture', joinedDate: 'Jul 20, 2026', commissionEarned: '$200.00', status: 'Active' },
  ];

  openEmailModal() {
    this.emailSubject = '';
    this.emailBody = '';
    this.showEmailModal.set(true);
  }

  closeEmailModal() {
    this.showEmailModal.set(false);
  }

  sendDirectEmail() {
    if (!this.emailSubject || !this.emailBody) {
      alert('Please fill in both the subject and body of the message.');
      return;
    }
    alert(`Email successfully dispatched to ${this.tailor()?.email}!`);
    this.closeEmailModal();
  }

  ngOnInit(): void {
    this.fetchTailor();
  }

  fetchTailor() {
    const id = this.ar.snapshot.paramMap.get('id');

    if(!id) {
      return this.location.back();
    }

    this.tailorService.getTailor(id).subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          this.tailor.set(response.data);
          console.log(this.tailor());
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  toggleSuspendAccount() {
    const t = this.tailor();
    if (!t) return;

    const newStatus = t.status === 'suspended' ? 'active' : 'suspended';
    
    // Update state
    this.tailor.update((item: any) => (item.id === t._id ? { ...item, status: newStatus } : item));

    this.tailor.set({ ...t, status: newStatus });
    alert(`Account for ${t.fullname} has been set to: ${newStatus.toUpperCase()}`);
  }

  confirmDeleteAccount() {
    return;
  }

  viewTailorDetails() {
    this.activeTab.set('info');
  }
}
