import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IPlan, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
    plans = signal<IPlan[]>([]);
    isLoaded = signal(false);

    private http = inject(HttpClient);

    fetchPlans(): Observable<IResponse<IPlan[]>> {
        return this.http.get<IResponse<IPlan[]>>(`${environment.base_api_url}/plans/list`);
    }
}
