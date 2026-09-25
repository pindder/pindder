import { Component, inject, Input } from '@angular/core';
import { IonContent, IonItem, IonList, 
  IonCheckbox, IonTitle, IonButton, ModalController, IonHeader,
  IonButtons, IonToolbar, IonIcon
} from '@ionic/angular';

@Component({
  selector: 'app-sizes-modal',
  imports: [
    IonHeader, IonButton, IonTitle, IonCheckbox, IonContent, 
    IonList, IonItem, IonButtons, 
    IonToolbar, IonIcon
  ],
  templateUrl: './sizes-modal.html',
  styleUrl: './sizes-modal.css',
})
export class SizesModal {
  @Input() sizes!: string [];

  private modalCtrl = inject(ModalController);

  checkboxChanged($event: CustomEvent, size: string) {
    this.sizes.push(size);
    console.log(this.sizes);
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
