import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateOrderButton } from '../create-order-button/create-order-button';
import { DataTypes } from '@pindder/contracts';

@Component({
  selector: 'app-empty-state',
  imports: [CreateOrderButton],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState implements OnInit{
  @Input() imgPath!: string;
  @Input() parentComponent!: string; 
  @Output() action = new EventEmitter();

  dataTypes = DataTypes;

  ngOnInit(): void {
    if(!this.imgPath) {
      this.imgPath = '/images/empty_state.png'
    }
  }

  launchCreateOrderModal() {
    this.action.emit();
  }  
}
