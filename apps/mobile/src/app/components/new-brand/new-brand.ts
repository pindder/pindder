import { ChangeDetectorRef, Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonList, IonSelect, 
  IonSelectOption, IonTextarea, IonIcon, ModalController,
  ToastController, AlertController, IonModal, IonButton, IonTitle, IonToolbar, IonButtons, IonHeader } from "@ionic/angular";
import { PrimaryButton } from '../primary-button/primary-button';
import { countries, IAddress, IBankDetail, IBrand, IProfile, IResponse } from '@pindder/contracts';
import { BrandService } from '../../services/brand.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IonText } from "@ionic/angular";
import { IonLabel } from "@ionic/angular";
import { TokenService } from '../../services/token.service';
import { NewAddress } from '../new-address/new-address';
import { IonItemSliding, IonItemOptions, IonItemOption } from "@ionic/angular";
import { EmptyState } from '../empty-state/empty-state';
import { AppService } from '../../services/app.service';
import { Browser } from '@capacitor/browser';
import { AppButton } from '@pindder/shared-ui';

@Component({
  selector: 'app-new-brand',
  imports: [IonHeader, IonButtons, IonToolbar, IonTitle, IonButton,
    IonModal,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel, IonText,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonContent,
    FormsModule,
    IonSelectOption,
    PrimaryButton,
    IonTextarea, EmptyState, AppButton],
  templateUrl: './new-brand.html',
  styleUrl: './new-brand.css',
})
export class NewBrand implements OnInit{
  @ViewChild('modal') modal!: IonModal;
  @ViewChild('newAccountModal') newAccountModal!: IonModal;
  
  private brandService = inject(BrandService);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService);
  private appService = inject(AppService);
  private modalController = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  profile!: IProfile;
  brand = signal<IBrand>({
    name: '',
    bio: '',
    email: '',
    country: countries[38].name,
    countryCode: countries[38].code,
    website: '',
    tel: '',  
  });
  bankDetail: IBankDetail = {
    bank: '',
    accountName: '',
    accountNo: '',
  };
  addresses: IAddress[] = [];
  countries = countries;
  bvn!: string;
  bank_list: any[] = [];

  customModalOptions = {
    header: 'Select Country Code',
    breakpoints: [0, 0.75],
    initialBreakpoint: 0.5,
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile() {
    const profileStr = await this.tokenService.getProfile();
    if(profileStr) this.profile = JSON.parse(profileStr);
    this.cdr.markForCheck();
    
    this.getBrand(this.profile); 
  }

  async openNewAddressModal(address?: IAddress) {
    const modal = await this.modalController.create({
      component: NewAddress,
      componentProps: {
        location: address ?? null
      }
    });

    await modal.present();
  }

  async openNewAccountModal(account?: IBankDetail) {
    if(account) {
      this.bankDetail = account;
    }

    this.newAccountModal.present();
  }

  getBrand(profile: IProfile) {
    if(!profile._id) {
      return;
    }

    this.brandService.getBrand(profile._id).subscribe({
      next: (response: IResponse<IBrand>) => {
        if(response.data) {
          this.brand.set(response.data);
          this.getAddresses(this.brand());
          this.fetchBanks();
          this.cdr.markForCheck();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  fetchBankDetails() {
    this.appService.fetchPayoutDetail().subscribe({
      next: (response: IResponse<IBankDetail[]>) => {
        if(response.data) this.bankDetail = response.data[0];
      },
      error: (error: HttpErrorResponse) => {
        this.presentToast(`${error.error.msg}`, 'danger', 'bottom');
      }
    });
  }

  fetchBanks() {
    this.appService.fetchBanks().subscribe({
      next: (response: any) => {
        this.bank_list = response;
        this.fetchBankDetails();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  getAddresses(brand: IBrand) {
    if(!brand._id) {
      return;
    }

    this.brandService.getAddresses(brand._id).subscribe({
      next: (response: IResponse<IAddress[]>) => {
        if(response.data) {
          this.addresses = response.data;
          this.cdr.markForCheck();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  async manageAccount() {
    const url = await this.appService.manageStripeAccount()

    if(url) {
      Browser.open({
        url: url,
        presentationStyle: 'fullscreen',
        toolbarColor: 'primary',
      });
    }
  }

  openAddressesModal() {
    this.modal.present();
  }

  updateCountryCode(event: unknown) {
    const country = this.countries.find(c => c.name == event); 
    this.brand.update(b => b ? {...b, countryCode: country?.code} : b);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  createBrand() {
    this.brandService.createBrand(this.brand()).subscribe({
      next: (response: IResponse<IBrand>) => {
        this.presentToast(response.msg, 'primary', 'top');
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.presentToast(error.error.msg, 'danger', 'top');
        this.cdr.markForCheck();
      }
    });
  }

  updateBrand() {
    this.brandService.updateBrand(this.brand()).subscribe({
      next: (response: IResponse<IBrand>) => {
        this.presentToast(response.msg, 'primary', 'top');
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.presentToast(error.error.msg, 'danger', 'top');
        this.cdr.markForCheck();
      }
    });
  }

  submit() {
    if(this.brand()._id) {
      this.updateBrand();
    } else {
      this.createBrand();
    }
  }

  editAddress() {
    this.openNewAddressModal()
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

  async presentDeleteAlert(address: IAddress) {
    const alert = await this.alertCtrl.create({
      header: `Delete Account Detail`,
      message: `Are you sure you want to delete this address?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.deleteAddress(address);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAddress(address: IAddress) {
    if(!address._id) {
      return;
    }

    this.brandService.deleteAddress(address._id).subscribe({
      next: (response: IResponse<unknown>) => {
        if(response.data) {
          this.presentToast(response.msg, 'primary', 'top');
          this.cdr.markForCheck();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.presentToast(error.error.message, 'danger', 'top');
        this.cdr.markForCheck();
      }
    })
  }

  submitBankDetail() {
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
}
