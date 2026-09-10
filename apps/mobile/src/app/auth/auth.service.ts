import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILogin } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'auth_token';

  loginBrand(loginDto: ILogin): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login-brand`, loginDto);
  }

  registerBrand(createBrandDto: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register-brand`, createBrandDto)
    .pipe(
      switchMap((res) =>
        from(
          Preferences.set({
            key: this.TOKEN_KEY,
            value: res.access_token,
          })
        ).pipe(
          map(() => res)
        )
      )
    );
  }

  async logout(): Promise<void> {
    await Preferences.remove({
      key: this.TOKEN_KEY,
    });
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: token,
    });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({
      key: this.TOKEN_KEY,
    });

    return value;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();

    return !!token;
  }
}
