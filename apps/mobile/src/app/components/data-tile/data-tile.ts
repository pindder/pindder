import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonCardContent, IonText, IonCard } from "@ionic/angular";
import { IonLabel } from "@ionic/angular";

//import { IonButton, IonButtons } from "@ionic/angular";

@Component({
  selector: 'app-data-tile',
  imports: [IonLabel, IonCardContent, IonCard, IonIcon, IonText],
  templateUrl: './data-tile.html',
  styleUrl: './data-tile.css',
})
export class DataTile implements OnInit{
  @Input() data!:any;
  @Output() action = new EventEmitter<string>();
  
  ngOnInit(): void {
    console.log(this.data);
  }
}
