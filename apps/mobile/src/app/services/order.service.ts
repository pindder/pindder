import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  fetchOrders(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/orders`);
  }
}
