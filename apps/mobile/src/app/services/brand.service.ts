import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAddress, IBrand, IResponse } from '@pindder/contracts';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private http = inject(HttpClient);

  createBrand(brand: IBrand): Observable<IResponse<IBrand>> {
    return this.http.post<IResponse<IBrand>>(`${environment.apiUrl}/brands`, brand);
  }

  createAddress(address: IAddress): Observable<IResponse<IAddress>> {
    return this.http.post<IResponse<IAddress>>(`${environment.apiUrl}/address`, address);
  }

  updateBrand(brand: IBrand): Observable<IResponse<IBrand>> {
    return this.http.patch<IResponse<IBrand>>(`${environment.apiUrl}/brands/${brand._id}`, brand);
  }

  updateAddress(address: IAddress): Observable<IResponse<IAddress>> {
    return this.http.patch<IResponse<IAddress>>(`${environment.apiUrl}/brands/${address._id}`, address);
  }

  getBrand(tailor_id: string): Observable<IResponse<IBrand>> {
    return this.http.get<IResponse<IBrand>>(`${environment.apiUrl}/brands/${tailor_id}`);
  }

  getAddresses(tailor_id: string): Observable<IResponse<IAddress[]>> {
    return this.http.get<IResponse<IAddress[]>>(`${environment.apiUrl}/address/${tailor_id}`);
  }
}
