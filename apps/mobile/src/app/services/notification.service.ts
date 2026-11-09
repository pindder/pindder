import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { INotification, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  
  // Private mutable signal holding the list of notifications
  private notificationsSignal = signal<INotification[]>([]);
  private isLoaded = signal<boolean>(false);
  
  // Public read-only signal for your components to consume
  notifications = this.notificationsSignal.asReadonly();
  hasLoaded = this.isLoaded.asReadonly();
  totalUnreadNotifications = signal<number>(0);
  page = signal<number>(1);
  limit = signal<number>(20)

  // Add a brand new notification (called when SSE fires)
  addNotification(notification: INotification) {
    this.notificationsSignal.update(currentList => [notification, ...currentList]);
    this.isLoaded.set(true);
  }

  updateNotification(notificationId: string) {
    this.notificationsSignal.update(currentNotifications => currentNotifications.map(
      notification => notification._id === notificationId ? { ...notification, read: !notification.read } : notification
    ));
    
    this.markAsRead(notificationId).subscribe({
      next: (response: IResponse<any>) => {
        console.log(response.data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  // Load existing notifications fetched from your backend API on page load
  setInitialNotifications(list: INotification[]) {
    this.notificationsSignal.set(list);
  }

  getNotifications(userId: string): Observable<IResponse<INotification[]>> {
    let params = new HttpParams();
  
    params = params.set('page', this.page().toString());
    params = params.set('limit', this.limit().toString());
    
    return this.http.get<IResponse<INotification[]>>(`${environment.apiUrl}/notifications/account/${userId}`, { params });
  }

  getRecentNotifications(userId: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/notifications/account/${userId}/recent`);
  }

  markAsRead(notification_id: string): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/notifications/${notification_id}`, { read: true });
  }
}
