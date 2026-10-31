import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonSelectOption, ViewWillEnter, IonSelect, ToastController, IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, ModalController, IonNote } from "@ionic/angular";
import { DataTypes, Gender, IClient, IResponse } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimaryButton } from '../primary-button/primary-button';
import { IonLabel } from "@ionic/angular";
import { Measurement } from '../measurement/measurement';

@Component({
  selector: 'app-new-client',
  imports: [
    IonLabel,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonSelect,
    IonContent,
    FormsModule,
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    PrimaryButton,
    IonNote
],
  templateUrl: './new-client.html',
  styleUrl: './new-client.css',
})
export class NewClient implements ViewWillEnter{
  @Output() closeModal = new EventEmitter();
  @Input() origin!: string;

  private clientService = inject(ClientService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);

  client: IClient = {
    firstname: '',
    lastname: '',
    email: '',
    phoneNo: '',
    referee: '',
    gender: '',
    address: '',
    measurements: [],
  };

  genders: string[] = Object.keys(Gender);

  ionViewWillEnter(): void { 
    console.log(this.origin)
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  async openMeasurementModal() {
    const modal = await this.modalCtrl.create({
      component: Measurement,
      componentProps: {
        parent: DataTypes.CLIENT,
        client_gender: this.client.gender,
        measurement_list: this.client.measurements
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data) {
      console.log(data);
      this.client.measurements = data;
      this.cdr.markForCheck();
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    this.clientService.createClient(this.client).subscribe({
      next: (res: IResponse<IClient>) => {
        this.presentToast(res.msg, 'primary', 'top');
        //console.log(res.data);
        this.modalCtrl.dismiss(res.data, 'selected');
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }
}
