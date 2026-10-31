import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { IonLabel, IonItem, IonInput, IonSelectOption, IonSelect } from "@ionic/angular";
import { PrimaryButton } from '../primary-button/primary-button';
import { FormsModule } from '@angular/forms';
import { IBankDetail, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from '../../services/app.service';

export interface Withdrawal {
  amount: string;
  account: string;
  type: string;
}

@Component({
  selector: 'app-payout',
  imports: [IonInput, IonItem, IonLabel, IonLabel, PrimaryButton, 
    FormsModule, IonSelect, IonSelectOption
  ],
  templateUrl: './payout.html',
  styleUrl: './payout.css',
})
export class Payout implements OnInit{
  private appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);

  bankDetails = signal<IBankDetail[]>([]);
  withdraw = signal<Withdrawal>({
    account: '',
    amount: '',
    type: ''
  });

  ngOnInit(): void {
    this.fetchBankDetails();
  }

  fetchBankDetails() {
    this.appService.fetchPayoutDetails().subscribe({
      next: (response: IResponse<IBankDetail[]>) => {
        if(response.data) {
          this.bankDetails.set(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
    this.cdr.markForCheck();
  }

  submit() {
    return;
  }
}
