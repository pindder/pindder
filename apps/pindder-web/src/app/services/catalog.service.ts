import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private http = inject(HttpClient);

    fetchTailorCatalogs(tailor: string): Observable<IResponse<any[]>> {
        return this.http.get<IResponse<any[]>>(`${environment.apiUrl}/designs/catalogs/${tailor}`);
    }
}
