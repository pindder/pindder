import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IDesign } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  private http = inject(HttpClient)

  createDesign(design: IDesign): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/designs`, design);
  }

  fetchDesigns() {
    return this.http.get<any>(`${environment.apiUrl}/designs`);
  }
}
