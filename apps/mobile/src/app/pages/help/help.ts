import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-help',
  imports: [IonHeader, IonContent, IonToolbar, IonButtons, IonTitle, IonBackButton ],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {}
