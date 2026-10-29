import { ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { PrimaryButton } from '../primary-button/primary-button';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IAddress, IResponse } from '@pindder/contracts';
import { BrandService } from '../../services/brand.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-address',
  imports: [
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonContent,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    PrimaryButton
  ],
  templateUrl: './new-address.html',
  styleUrl: './new-address.css',
})
export class NewAddress implements OnInit{
  @Input() location!: IAddress;

  private brandService = inject(BrandService);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);

  address = signal<IAddress>({
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    street: '',
    hq: false
  });

  ngOnInit(): void {
    if(this.location) {
      this.address.set(this.location);
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss(this.address, 'dismiss');
  }

  createAddress() {
    this.brandService.createAddress(this.address()).subscribe({
      next: (response: IResponse<IAddress>) => {
        if(response.data) {
          this.cdr.markForCheck();
          this.dismissModal();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  updateAddress() {
    this.brandService.updateAddress(this.address()).subscribe({
      next: (response: IResponse<IAddress>) => {
        if(response.data) {
          this.cdr.markForCheck();
          this.dismissModal();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  submit() {
    if(this.address()._id) {
      this.updateAddress()
    } else {
      this.createAddress();
    }
  }
}
