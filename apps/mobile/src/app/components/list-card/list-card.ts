import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter, IonIcon, AlertController, ToastController, IonLabel, IonButtons, IonButton } from '@ionic/angular';
import { DataTypes, IDesign, IResponse } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DesignService } from '../../services/design.service';

@Component({
  selector: 'app-list-card',
  imports: [IonLabel, DatePipe, IonIcon, IonButtons, IonButton],
  templateUrl: './list-card.html',
  styleUrl: './list-card.css',
})
export class ListCard implements ViewWillEnter{
  @Output() updateList = new EventEmitter();
  @Output() edit = new EventEmitter();

  @Input() dataType!: DataTypes;
  @Input() client!: any;
  @Input() design!: IDesign;

  /** Controllers */
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  /** Services */
  private clientService = inject(ClientService);
  private designService = inject(DesignService);

  dataTypes = DataTypes;

  ionViewWillEnter(): void { }

  async presentDeleteAlert(dataType: string) {
    const alert = await this.alertCtrl.create({
      header: `Remove ${dataType == DataTypes.DESIGN ? 'Style' : dataType}`,
      message: `Are you sure you want to remove this ${dataType == DataTypes.DESIGN ? 'Style' : dataType }?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'confirm',
          handler: () => {
            switch (dataType) {
              case DataTypes.CLIENT:
                this.deleteClient();
                break;
              case DataTypes.DESIGN:
                this.deleteDesign();
                break;
              case DataTypes.ORDER:
                this.deleteOrder();
                break;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  viewClient() {
    this.router.navigate(['/app/clients/' + this.client._id ]);
  }

  deleteClient() {
    this.clientService.removeClient(this.client._id).subscribe({
      next: (res: IResponse<string>) => {
        this.updateList.emit(this.client);
        this.presentToast(res.msg, 'primary', 'top');
      },
      error: (error: HttpErrorResponse) =>  {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }

  editDesign() {
    this.edit.emit(this.design._id);
  }

  deleteDesign() {
    this.designService.removeDesign(this.design._id!).subscribe({
      next: (res: IResponse<string>) => {
        this.updateList.emit(this.design);
        this.presentToast(res.msg, 'primary', 'top');
      },
      error: (error: HttpErrorResponse) =>  {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }

  deleteOrder() {}
}
