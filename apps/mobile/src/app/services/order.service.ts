import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOrder, IOrderItem, IResponse } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  createOrder(order: IOrder): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(`${environment.apiUrl}/orders`, order);
  }

  fetchOrders(status?: string): Observable<IResponse<any>> {
    let params = new HttpParams()
    .set('page', 1)
    .set('limit', 10);

    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/orders`, {params});
  }

  fetchOrder(order_id: string): Observable<IResponse<IOrderItem>> {
    return this.http.get<IResponse<IOrderItem>>(`${environment.apiUrl}/orders/${order_id}`);
  }

  cancelOrder(order_id: string): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/orders/${order_id}/cancel`, {});
  }

  searchOrders(query: string) : Observable<IResponse<IOrderItem[]>> {
    const params = new HttpParams().set('q', query);

    return this.http.get<IResponse<IOrderItem[]>>(`${environment.apiUrl}/orders/search`, { params });
  }
}
