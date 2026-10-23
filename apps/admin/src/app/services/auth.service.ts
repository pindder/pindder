import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(loginData: ILogin): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(`${environment.apiUrl}/auth/admin-login`, loginData);
  }
}
