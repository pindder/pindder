import { HttpClient, HttpParams } from '@angular/common/http';
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

  fetchClients(): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/clients`);
  }

  fetchClient(client_id: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/clients/${client_id}`).pipe(
      switchMap((clientRes: IResponse<any>) => {
        // Safe check if client payload exists
        const clientData = clientRes?.data;
        if (!clientData) {
          return of(clientRes);
        }

        // Use client_id or clientData.id (matching your UUID strategy)
        const targetId = clientData.id || clientData._id || client_id;

        return this.http.get<IResponse<any>>(`${environment.apiUrl}/measurements/${targetId}`).pipe(
          map((measurementRes: IResponse<any>) => ({
            ...clientRes,
            data: {
              ...clientData,
              measurements: measurementRes.data ?? null,
            },
          })),
          catchError((error) => {
            console.warn(`Failed to load measurements for client ${targetId}:`, error);

            // Preserve client payload while falling back cleanly for measurements
            return of({
              ...clientRes,
              data: {
                ...clientData,
                measurements: null,
              },
            });
          })
        );
      })
    );
  }

  searchClient(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);

    return this.http.get<any[]>(`${environment.apiUrl}/clients/search`, { params });
  }

  removeClient(client_id: string): Observable<IResponse<string>> {
    return this.http.delete<IResponse<string>>(`${environment.apiUrl}/clients/${client_id}`);
  }

  updateClient(client_id: string, client: IClient): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/clients/${client_id}`, client);
  }

  createMeasurement(measurement: IMeasurement): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/measurements`, measurement);
  }

  fetchClientMeasurements(client_id: string): Observable<IResponse<any[]>> {
    return this.http.get<IResponse<any[]>>(`${environment.apiUrl}/measurements/${client_id}`);
  }

  updateClientMeasurement(measurement_id: string, measurement: IMeasurement): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${environment.apiUrl}/measurements/${measurement_id}`, measurement);
  }
}
