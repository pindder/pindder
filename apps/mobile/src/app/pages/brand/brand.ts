import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { NewBrand } from '../../components/new-brand/new-brand';

@Component({
  selector: 'app-brand',
  imports: [
    IonHeader, IonContent, IonToolbar, IonBackButton, IonButtons,
    IonTitle,
    NewBrand
],
  templateUrl: './brand.html',
  styleUrl: './brand.css',
})
export class Brand { }
