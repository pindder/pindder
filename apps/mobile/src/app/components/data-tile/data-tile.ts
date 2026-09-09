import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonButton } from "@ionic/angular";

@Component({
  selector: 'app-data-tile',
  imports: [IonIcon, IonButton],
  templateUrl: './data-tile.html',
  styleUrl: './data-tile.css',
})
export class DataTile implements OnInit{
  @Input() data!:any;
  
  ngOnInit(): void {
    console.log(this.data);
  }
}
