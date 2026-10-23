import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  getOrders(): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/orders`);
  }

  getOrder(order_id: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/orders/${order_id}`);
  }

  cancelOrder(order_id: string): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/orders/${order_id}/status`, {});
  }
}
