import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProfile, IResponse } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/account/profile`);
  }

  updateProfile(profile: IProfile): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(`${environment.apiUrl}/`, profile);
  }
}
