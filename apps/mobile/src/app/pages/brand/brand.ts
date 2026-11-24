import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonNote, IonLabel } from '@ionic/angular';
import { NewBrand } from '../../components/new-brand/new-brand';

@Component({
  selector: 'app-brand',
  imports: [IonLabel, IonNote, 
    IonHeader, IonContent, IonToolbar, IonBackButton, IonButtons,
    IonTitle,
    NewBrand,
    IonItem
],
  templateUrl: './brand.html',
  styleUrl: './brand.css',
})
export class Brand { 
  openAddressModal() {
    return;
  }
}
