import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ViewWillEnter, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon } from '@ionic/angular';
import { DataTypes, IDesign } from '@pindder/contracts';

@Component({
  selector: 'app-list-card',
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCard, IonCardHeader, DatePipe, IonIcon],
  templateUrl: './list-card.html',
  styleUrl: './list-card.css',
})
export class ListCard implements OnInit, ViewWillEnter{
  @Input() dataType!: DataTypes;
  @Input() client!: any;
  @Input() design!: IDesign;

  dataTypes = DataTypes;

  ionViewWillEnter(): void {
    console.log(this.client);
    console.log(this.design);
  }
  
  ngOnInit(): void {
    console.log(this.client);
    console.log(this.design);
  }
}
