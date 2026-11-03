import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, IResponse, IVerification, TailorReg } from '@pindder/contracts';
import { from, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environment/environment.prod';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);

    login(loginDto: ILogin): Observable<any> {
        from(this.tokenService.setPreferenceValue('email', loginDto.email));
        return this.http.post<any>(`${environment.base_api_url}/auth/login-tailor`, loginDto);
    }

    registerTailor(tailorRegDto: TailorReg): Observable<any> {
    return this.http.post<any>(
      `${environment.base_api_url}/auth/register-tailor`, 
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
      `${environment.base_api_url}/auth/verify-code`, 
      verificationDto
    ).pipe(switchMap((res) => {
      this.tokenService.setToken(res.token);
      return this.tokenService.getProfile();
    }));
  }

  resendCode(email: string, acctType: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.base_api_url}/auth/resend-token?email=${email}&acctType=${acctType}`);
  }

  async logout(): Promise<void> {
    this.tokenService.removeToken()
  }
}
