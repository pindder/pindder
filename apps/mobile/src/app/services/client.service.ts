import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IClient } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);

  createClient(client: IClient): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/clients`, client);
  }

  fetchClients(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/clients`);
  }
}
