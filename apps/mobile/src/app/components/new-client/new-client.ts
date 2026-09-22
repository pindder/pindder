import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonSelectOption, 
  ViewWillEnter, IonSelect, ToastController, IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  ModalController
} from "@ionic/angular";
import { Gender, IClient, IResponse } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-client',
  imports: [
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
    IonIcon
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

  client: IClient = {
    firstname: '',
    lastname: '',
    email: '',
    phoneNo: '',
    referee: '',
    gender: '',
    address: '',
  };

  genders: string[] = Object.keys(Gender);;

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
      duration: 1500,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    this.clientService.createClient(this.client).subscribe({
      next: (res: IResponse<IClient>) => {
        this.presentToast(res.msg, 'primary', 'top');
        console.log(res.data);
        this.modalCtrl.dismiss(res.data, 'selected');
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }
}
