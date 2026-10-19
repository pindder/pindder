import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOrder, IOrderItem, IOrderWithPayment, IPayment, IResponse } from '@pindder/contracts';

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

  fetchOrder(order_id: string): Observable<IResponse<IOrderWithPayment>> {
    return this.http
    .get<IResponse<IOrderItem>>(`${environment.apiUrl}/orders/${order_id}`)
    .pipe(
      switchMap((orderRes: IResponse<IOrderItem>) => {
        const orderData = orderRes.data;
        const paymentId = orderData?._id; 

        return this.http.get<IResponse<IPayment[]>>(`${environment.apiUrl}/payment/orders/${paymentId}`).pipe(
          map((paymentRes: IResponse<IPayment[]>) => {
            return {
              statusCode: 200,
              msg: 'Order and payment retrieved successfully',
              data: {
                order: orderData,
                payment: paymentRes.data
              }
            };
          })
        );
      })
    );
  }

  cancelOrder(order_id: string): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/orders/${order_id}/cancel`, {});
  }

  searchOrders(query: string) : Observable<IResponse<IOrderItem[]>> {
    const params = new HttpParams().set('q', query);

    return this.http.get<IResponse<IOrderItem[]>>(`${environment.apiUrl}/orders/search`, { params });
  }

  updateOrderStatus(order: IOrderItem): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/orders/${order._id}`, { status: order.status });
  }
}
