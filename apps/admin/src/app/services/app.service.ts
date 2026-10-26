import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private http = inject(HttpClient);

  getAdminAccounts(): Observable<IResponse<any[]>> {
    return this.http.get<IResponse<any[]>>(`${environment.apiUrl}/admin`);
  }

  getAdminAccount(admin_id: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/admin/${admin_id}`);
  }

  createAdminAccount(admin_id: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/admin?admin=${admin_id}`);
  }
}
