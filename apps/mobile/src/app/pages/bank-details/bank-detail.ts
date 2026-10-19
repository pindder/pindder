import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { IonContent, IonList, IonBackButton, IonToolbar, IonButtons, IonHeader, 
  IonIcon, IonTitle, ViewWillEnter, IonButton, IonModal, IonItem, IonInput, 
  IonToggle, IonLabel, IonNote, 
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  AlertController,
  ToastController
} from '@ionic/angular';
import { AsyncPipe } from '@angular/common';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { EmptyState } from '../../components/empty-state/empty-state';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { DataTypes, IBankDetail, IResponse } from '@pindder/contracts';
import { AppService } from '../../services/app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-detail',
  imports: [IonNote, IonToggle,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonInput,
    IonItem,
    FormsModule,
    IonIcon,
    IonList,
    IonContent,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonList,
    AsyncPipe,
    PrimaryButton,
    EmptyState,
    IonButton,
    IonIcon,
    IonModal, IonLabel],
  templateUrl: './bank-detail.html',
  styleUrl: './bank-detail.css',
})
export class BankDetail implements ViewWillEnter{
  @ViewChild('modal') modal!: IonModal;

  private appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  isLoading = true;
  bankDetails$!: Observable<IBankDetail[]>;
  bankDetail: IBankDetail = {
    bankName: '',
    accountName: '',
    accountNo: '',
    sortCode: '',
    disabled: false
  };

  dataTypes = DataTypes;

  ionViewWillEnter(): void {  
    this.fetchBankDetails();
  }

  initBankDetails() {
    this.bankDetail = {
      bankName: '',
      accountName: '',
      accountNo: '',
      sortCode: '',
      disabled: false
    };
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  updateBankList(bankDetail: IBankDetail) {
    return;
  }

  fetchBankDetails() {
    this.bankDetails$ = this.appService.fetchPayoutDetails()
    .pipe(
      map((res: IResponse<IBankDetail[]>) => res.data || []),
      catchError((error: HttpErrorResponse) => {
        console.error('Fetch Orders Error:', error);
        return of([]); // Return empty array on error to keep stream alive
      }),
      tap(() => {
        this.isLoading = false;
      })
    );
    this.cdr.markForCheck();
  }

  dismissModal() {
    this.modal.dismiss();
    this.initBankDetails();
    this.fetchBankDetails();
  }

  openNewBankModal() {
    this.modal.present();
  }

  editBank(bankDetail: IBankDetail) {
    this.bankDetail = bankDetail;
    this.openNewBankModal();
  }

  deleteBank(bankDetail: IBankDetail) {
    this.appService.deletePayoutDetail(bankDetail._id!).subscribe({
      next: (response: IResponse<IBankDetail>) => {
        this.presentToast(response.msg, 'primary', 'top');
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.error.message, 'primary', 'top');
      }
    });
  }

  submit() {
    if(this.bankDetail._id) {
      this.appService.updatePayoutDetail(this.bankDetail).subscribe({
        next: (response: IResponse<IBankDetail>) => {
          this.presentToast(response.msg, 'primary', 'top');
          this.dismissModal();
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          this.presentToast(error.error.message, 'primary', 'top');
        }
      });
    } else {
      this.appService.createNewPayoutDetail(this.bankDetail).subscribe({
        next: (response: IResponse<IBankDetail>) => {
          this.presentToast(response.msg, 'primary', 'top');
          this.dismissModal();
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          this.presentToast(error.error.message, 'primary', 'top');
        }
      });
    }
  }

  async presentDeleteAlert(bankDetail: IBankDetail) {
    const alert = await this.alertCtrl.create({
      header: `Delete Account Detail`,
      message: `Are you sure you want to delete ${bankDetail.bankName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.deleteBank(bankDetail);
          }
        }
      ]
    });

    await alert.present();
  }
}
