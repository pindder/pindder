import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonLabel } from "@ionic/angular";
//import { IonButton, IonButtons } from "@ionic/angular";

@Component({
  selector: 'app-data-tile',
  imports: [IonLabel, IonIcon],
  templateUrl: './data-tile.html',
  styleUrl: './data-tile.css',
})
export class DataTile implements OnInit{
  @Input() data!:any;
  
  ngOnInit(): void {
    console.log(this.data);
  }
}
