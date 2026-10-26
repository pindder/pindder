import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);

  getSubscriptions(): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/subscription`);
  }
}
