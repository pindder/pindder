import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProfile } from '@pindder/contracts';
import { IonIcon, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular';
import { IonText } from "@ionic/angular";

@Component({
  selector: 'app-earnings-card',
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonIcon, IonButton],
  templateUrl: './earnings-card.html',
  styleUrl: './earnings-card.css',
})
export class EarningsCard implements OnInit{
  @Input() profile!: IProfile;
  @Output() withdraw = new EventEmitter();
  @Output() earn = new EventEmitter();

  ngOnInit(): void {
    return;
  }
}
