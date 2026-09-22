import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateOrderButton } from '../create-order-button/create-order-button';
import { DataTypes } from '@pindder/contracts';
import { IonIcon } from "@ionic/angular";

@Component({
  selector: 'app-empty-state',
  imports: [IonIcon, CreateOrderButton],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState implements OnInit{
  @Input() imgPath!: string;
  @Input() icon!: string;
  @Input() title!: string;
  @Input() desc!: string;
  @Input() buttonText!: string;
  @Input() parentComponent!: string; 
  @Output() action = new EventEmitter();

  dataTypes = DataTypes;

  ngOnInit(): void {
    if(!this.imgPath && !this.icon) {
      this.imgPath = '/images/empty_state.png'
    }
  }

  clickAction() {
    this.action.emit();
  }
}
