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
  @Input() selectedSizes!: string[];

  private modalCtrl = inject(ModalController);

  checkboxChanged(size: string) {
    this.selectedSizes.push(size);
  }

  dismissModal() {
    this.modalCtrl.dismiss(this.selectedSizes, 'sizes');
  }
}
