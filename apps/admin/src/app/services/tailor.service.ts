import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse, ITailor } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class TailorService {
  private http = inject(HttpClient);

  getTailors(): Observable<IResponse<ITailor[]>> {
      return this.http.get<IResponse<ITailor[]>>(`${environment.apiUrl}/tailor`);
    }
  
    getTailor(tailor_id: string): Observable<IResponse<ITailor>> {
      return this.http.get<IResponse<ITailor>>(`${environment.apiUrl}/tailor/${tailor_id}`);
    }
  
    suspendTailor(tailor: any): Observable<IResponse<any>> {
      return this.http.patch<IResponse<any>>(`${environment.apiUrl}/tailor/${tailor._id}`, tailor);
    }

    getTailorClients(tailor_id: string): Observable<IResponse<any>> {
      return this.http.get<IResponse<any>>(`${environment.apiUrl}/clients?tailor_id=${tailor_id}`);
    }
}
