import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }
}
