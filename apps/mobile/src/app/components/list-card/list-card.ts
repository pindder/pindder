import { Component, Input, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { DataTypes } from '@pindder/contracts';

@Component({
  selector: 'app-list-card',
  imports: [],
  templateUrl: './list-card.html',
  styleUrl: './list-card.css',
})
export class ListCard implements OnInit, ViewWillEnter{
  @Input() dataType!: DataTypes;
  @Input() client!: any;

  dataTypes = DataTypes;

  ionViewWillEnter(): void {
    
  }
  
  ngOnInit(): void {
    console.log(this.client);
  }
}
