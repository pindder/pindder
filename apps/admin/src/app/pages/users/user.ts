import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }
}
