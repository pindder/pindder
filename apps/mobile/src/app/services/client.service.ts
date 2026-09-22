import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IClient, IMeasurement, IResponse } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);

  createClient(client: IClient): Observable<IResponse<IClient>> {
    return this.http.post<IResponse<IClient>>(`${environment.apiUrl}/clients`, client);
  }

  fetchClients(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/clients`);
  }

  fetchClient(client_id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/clients/${client_id}`
    ).pipe(
      switchMap((client) => {
        // Fetch measurements using client.measurementId
        return this.http.get<any>(`${environment.apiUrl}/measurements/${client._id}`).pipe(
          map((measurements) => ({
            client,
            measurements
          })),
          catchError((error) => {
          console.warn('Failed to load measurements for client:', client._id, error);
          
          // Return the client with a safe fallback for measurements
          return of({
            client,
            measurements: null // Or { measurements: {} } depending on your schema
          });
        })
        );
      })
    );
  }

  searchClient(query: string): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/clients/search?q=${encodeURIComponent(query)}`);
  }
  removeClient(client_id: string): Observable<IResponse<string>> {
    return this.http.delete<IResponse<string>>(`${environment.apiUrl}/clients/${client_id}`);
  }

  createMeasurement(measurement: IMeasurement): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/measurements`, measurement);
  }

  fetchClientMeasurements(client_id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/measurements/${client_id}`);
  }
}
