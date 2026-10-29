import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonList, IonSelect, 
  IonSelectOption, IonTextarea, IonListHeader,
  IonButtons,
  IonButton,
  IonIcon,
  ModalController,
  ToastController,
  AlertController, 
} from "@ionic/angular";
import { PrimaryButton } from '../primary-button/primary-button';
import { countries, IAddress, IBrand, IProfile, IResponse } from '@pindder/contracts';
import { BrandService } from '../../services/brand.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IonText } from "@ionic/angular";
import { IonLabel } from "@ionic/angular";
import { TokenService } from '../../services/token.service';
import { NewAddress } from '../new-address/new-address';
import { IonItemSliding, IonNote, IonItemOptions, IonItemOption } from "@ionic/angular";
import { EmptyState } from '../empty-state/empty-state';

@Component({
  selector: 'app-new-brand',
  imports: [IonItemOption, IonItemOptions, IonNote, IonItemSliding, IonLabel, IonText,
    IonButtons, IonButton, IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonContent,
    FormsModule,
    IonSelectOption,
    PrimaryButton,
    IonTextarea, IonListHeader, EmptyState],
  templateUrl: './new-brand.html',
  styleUrl: './new-brand.css',
})
export class NewBrand implements OnInit{
  private brandService = inject(BrandService);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService);
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
  addresses: IAddress[] = [];
  countries = countries;

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

  getBrand(profile: IProfile) {
    this.brandService.getBrand(profile._id!).subscribe({
      next: (response: IResponse<IBrand>) => {
        if(response.data) {
          this.brand.set(response.data);
          this.getAddresses(this.brand());
          this.cdr.markForCheck();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  getAddresses(brand: IBrand) {
    this.brandService.getAddresses(brand._id!).subscribe({
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

  updateCountryCode(event: any) {
    const country = this.countries.find(c => c.name == event); 
    this.brand.update(b => b ? {...b, countryCode: country?.code} : b);
  }

  dismissModal() {
    return;
  }

  createBrand() {
    this.brandService.createBrand(this.brand()).subscribe({
      next: (response: IResponse<IBrand>) => {
        console.log(response.data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  updateBrand() {
    this.brandService.updateBrand(this.brand()).subscribe({
      next: (response: IResponse<IBrand>) => {
        console.log(response.data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
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

  editAddress(address: IAddress) {
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
    return;
  }
}
