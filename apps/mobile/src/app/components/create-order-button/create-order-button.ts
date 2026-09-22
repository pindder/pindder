import { Component } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular";

@Component({
  selector: 'app-create-order-button',
  imports: [IonIcon, IonButton, ],
  templateUrl: './create-order-button.html',
  styleUrl: './create-order-button.css',
})
export class CreateOrderButton { }
