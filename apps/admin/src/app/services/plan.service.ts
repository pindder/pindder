import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPlan, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private http = inject(HttpClient);

  getPlans(): Observable<IResponse<IPlan[]>> {
    return this.http.get<IResponse<IPlan[]>>(`${environment.apiUrl}/plans`);
  }

  getPlan(plan_id: string): Observable<IResponse<IPlan>> {
    return this.http.get<IResponse<IPlan>>(`${environment.apiUrl}/plans/${plan_id}`);
  }

  createFreePlan(): Observable<IResponse<IPlan>> {
    return this.http.post<IResponse<IPlan>>(`${environment.apiUrl}/plans?type=free`, {});
  }

  createPlan(plan: IPlan): Observable<IResponse<IPlan>> {
    return this.http.post<IResponse<IPlan>>(`${environment.apiUrl}/plans`, plan);
  }
}
