import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILogin, IVerification, TailorReg } from '@pindder/contracts';
import { TokenService } from '../services/token.service';
import { Preferences } from '@capacitor/preferences';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);

  loginBrand(loginDto: ILogin): Observable<any> {
    from(
      Preferences.set({
        key: 'email',
        value: loginDto.email
      })
    );
    return this.http.post<any>(`${environment.apiUrl}/auth/login-tailor`, loginDto);
  }

  registerBrand(createBrandDto: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/auth/register-brand`, 
      createBrandDto
    ).pipe(
      switchMap((res) =>
        from(
          this.tokenService.setToken(res.access_token)
        ).pipe(
          map(() => res)
        )
      )
    );
  }

  registerTailor(tailorRegDto: TailorReg): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/auth/register-tailor`, 
      tailorRegDto
    ).pipe(
      switchMap((res) =>
        from(
          this.tokenService.setToken(res.access_token)
        ).pipe(
          map(() => res)
        )
      )
    );;
  }

  verifyCode(verificationDto: IVerification): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/auth/verify-code`, 
      verificationDto
    ).pipe(switchMap((res) => {
      this.tokenService.setToken(res.token);
      return this.profileService.getProfile();
    }));
  }

  resendCode(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/resend-token`, { email: email });
  }

  async logout(): Promise<void> {
    this.tokenService.removeToken()
  }
}
