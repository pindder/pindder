import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPayment, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  getPayments(): Observable<IResponse<IPayment[]>> {
    return this.http.get<IResponse<IPayment[]>>(`${environment.apiUrl}/payment`);
  }

  getPayment(payment_id: string): Observable<IResponse<IPayment>> {
    return this.http.get<IResponse<IPayment>>(`${environment.apiUrl}/payment/${payment_id}`);
  }
}
