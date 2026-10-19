import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPayment, IPlan, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private httpService = inject(HttpClient);
  
  fetchPlans(): Observable<IResponse<IPlan[]>> {
    return this.httpService.get<IResponse<IPlan[]>>(`${environment.apiUrl}/plans`);
  }

  subscribe(paymentObj: IPayment): Observable<IResponse<any>> {
    return this.httpService.post<IResponse<any>>(`${environment.apiUrl}/subscription/init`, paymentObj);
  }
}
