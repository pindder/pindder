import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-subscription',
  imports: [],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription {
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }
}
