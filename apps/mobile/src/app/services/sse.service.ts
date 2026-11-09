// sse.service.ts (Angular Client)
import { inject, Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalNotifications } from '@capacitor/local-notifications';
import { DataTypes, INotification } from '@pindder/contracts';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private zone = inject(NgZone);
  private notificationService = inject(NotificationService);
  private notificationsEventSource!: EventSource;
  private balanceEventSource!: EventSource;

  async connectToNotificationStream(userId: string) {
    // create a connection when connection has not been initialized
    if(!this.notificationsEventSource) {
      this.notificationsEventSource = new EventSource(`${environment.apiUrl}/notifications/stream/${userId}`);
    }
    
    this.notificationsEventSource.onmessage = (event) => {
      // 1. Run inside NgZone so Angular change detection picks up UI updates automatically
      this.zone.run(() => {
        const data: INotification = JSON.parse(event.data);
        console.log(data);
        this.notificationService.addNotification(data);

        // 3. Trigger the native mobile local notification (fire-and-forget or handle via .catch)
        this.triggerLocalNotification(data.action, JSON.stringify(data));
      });
    };

    this.notificationsEventSource.onerror = (error) => {
      this.zone.run(() => {
        console.error('SSE Error:', error);
      });
    };
  }

  async connectBalanceStream(userId: string) {
    if(!this.balanceEventSource) {
      this.balanceEventSource = new EventSource(`{environment.apiUrl}/streams/balance/${userId}`);
    }

    this.balanceEventSource.onmessage = (event) => {
      // 1. Run inside NgZone so Angular change detection picks up UI updates automatically
      this.zone.run(() => {
        const data: INotification = JSON.parse(event.data);
        console.log(data);
        this.notificationService.addNotification(data);

        // 3. Trigger the native mobile local notification (fire-and-forget or handle via .catch)
        this.triggerLocalNotification(data.title, JSON.stringify(data));
      });
    };

    this.balanceEventSource.onerror = (error) => {
      this.zone.run(() => {
        console.error('SSE Error:', error);
      });
    };
  }

  private async triggerLocalNotification(title: string, body: string) {
    try {
      let route_path = '';
      const event_data = JSON.parse(body);

      console.log('Triggered local notification:', event_data);

      switch(event_data.type) {
        case DataTypes.ORDER:
          route_path = 'orders';
          break;
        case DataTypes.CLIENT:
          route_path = 'clients';
          break;
        case DataTypes.DESIGN:
          route_path = 'styles';
          
      }
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: event_data.message, // Now strictly a string!
            id: new Date().getTime(), // Unique integer ID
            schedule: { at: new Date(Date.now() + 100) }, // Fire almost instantly
            sound: undefined, 
            extra: {
              route: `app/${route_path}/${event_data._id}` // Optional deep-link payload
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error triggering local notification:', error);
    }
  }

  disconnectAllEventSources() {
    if(!this.balanceEventSource && !this.notificationsEventSource) {
      return;
    }

    this.notificationsEventSource.close();
    this.balanceEventSource.close();
  }
}