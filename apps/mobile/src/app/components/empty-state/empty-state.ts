import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState implements OnInit{
  @Input() imgPath!: string;

  ngOnInit(): void {
    if(!this.imgPath) {
      this.imgPath = '/images/empty_state.png'
    }
  }
}
