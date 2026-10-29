// sse.service.ts (Angular Client)
import { inject, Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalNotifications } from '@capacitor/local-notifications';
import { INotification } from '@pindder/contracts';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private zone = inject(NgZone);
  private notificationService = inject(NotificationService);
  private eventSource!: EventSource;

  async connectToNotificationStream(userId: string) {
    this.eventSource = new EventSource(`${environment.apiUrl}/notifications/stream/${userId}`);

    this.eventSource.onmessage = (event) => {
      // 1. Run inside NgZone so Angular change detection picks up UI updates automatically
      this.zone.run(() => {
        const data: INotification = JSON.parse(event.data);
        
        this.notificationService.addNotification(data);

        // 3. Trigger the native mobile local notification (fire-and-forget or handle via .catch)
        this.triggerLocalNotification(data.action, JSON.stringify(data));
      });
    };

    this.eventSource.onerror = (error) => {
      this.zone.run(() => {
        console.error('SSE Error:', error);
      });
    };
  }

  private async triggerLocalNotification(title: string, body: string) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body, // Now strictly a string!
            id: new Date().getTime(), // Unique integer ID
            schedule: { at: new Date(Date.now() + 100) }, // Fire almost instantly
            sound: undefined, 
            extra: {
              route: 'app/dashboard/wallet' // Optional deep-link payload
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error triggering local notification:', error);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}