import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOrder, IOrderItem, IResponse } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  createOrder(order: IOrder): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/orders`, order);
  }

  fetchOrders(): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/orders`);
  }

  fetchOrder(order_id: string): Observable<IResponse<IOrderItem>> {
    return this.http.get<IResponse<IOrderItem>>(`${environment.apiUrl}/orders/${order_id}`);
  }
}
