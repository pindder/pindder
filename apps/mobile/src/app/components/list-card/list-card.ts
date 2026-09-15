import { Component, Input } from '@angular/core';
import { IonItem, ViewWillEnter, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-list-card',
  imports: [IonItem, IonCard],
  templateUrl: './list-card.html',
  styleUrl: './list-card.css',
})
export class ListCard implements ViewWillEnter{
  @Input() dataType!: string;
  @Input() data!: any;

  ionViewWillEnter(): void {

  }
}
