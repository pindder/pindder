// sse.service.ts (Angular Client)
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  constructor(private zone: NgZone) {}

  connectToNotificationStream(userId: string): Observable<any> {
    return new Observable((observer) => {
      const eventSource = new EventSource(`${environment.apiUrl}/notifications/stream/${userId}`);

      eventSource.onmessage = (event) => {
        // Run inside NgZone so Angular change detection picks up UI updates automatically
        this.zone.run(() => {
          const data = JSON.parse(event.data);
          observer.next(data);
        });
      };

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          observer.error(error);
        });
      };

      // Cleanup when subscription is unsubscribed
      return () => {
        eventSource.close();
      };
    });
  }
}