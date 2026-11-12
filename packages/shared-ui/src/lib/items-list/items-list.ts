import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, AlertController, ToastController, IonLabel, 
  IonButtons, IonButton, IonBadge } from '@ionic/angular';
import { DataTypes, IDesign, IOrderItem, OrderStatus } from '@pindder/contracts';

@Component({
  selector: 'lib-items-list',
  imports: [IonLabel, DatePipe, IonIcon, IonButtons, IonButton, IonBadge],
  templateUrl: './items-list.html',
  styleUrl: './items-list.css',
})
export class ListCard {
  @Output() updateList = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() action = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  @Output() updateAction = new EventEmitter();
  @Output() navigate = new EventEmitter();

  @Input() dataType!: DataTypes;
  @Input() client!: any;
  @Input() design!: IDesign;
  @Input() order!: IOrderItem;

  /** Controllers */
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  dataTypes = DataTypes;
  orderStatuses = OrderStatus;

  async presentDeleteAlert(dataType: string) {
    const alert = await this.alertCtrl.create({
      header: `Delete ${dataType == DataTypes.DESIGN ? 'Style' : dataType}`,
      message: `Are you sure you want to delete this ${dataType == DataTypes.DESIGN ? 'Style' : dataType }?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            switch (dataType) {
              case DataTypes.CLIENT:
                this.deleteClient();
                break;
              case DataTypes.DESIGN:
                this.deleteDesign();
                break;
              default:
                return;
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
    this.navigate.emit()
    this.router.navigate(['/app/clients/' + this.client._id ]);
  }

  deleteClient() {
    this.deleteAction.emit()
  }

  editDesign() {
    this.edit.emit(this.design._id);
  }

  deleteDesign() {
    this.deleteAction.emit();
  }
}
