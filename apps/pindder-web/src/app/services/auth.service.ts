import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, IProfile, IResponse, IUser, IVerification, TailorReg } from '@pindder/contracts';
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
      return this.http.post<any>(`${environment.apiUrl}/auth/login-tailor`, loginDto);
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
    );
  }

  registerUser(userReg: IUser): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(`${environment.apiUrl}/users`, userReg);
  }

  verifyCode(verificationDto: IVerification): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/auth/verify-code`, 
      verificationDto
    ).pipe(switchMap((res) => {
      this.tokenService.setToken(res.token);
      return this.getProfile();
    }));
  }

  getProfile(acct_id?: string, acctType?: string): Observable<IResponse<IProfile>> {
    let params = new HttpParams();

    if(acct_id && acctType) {
      params = params.set('account', acct_id);
      params = params.set('acctType', acctType);
    }

    return this.http.get<IResponse<IProfile>>(`${environment.apiUrl}/account/profile`, { params })
    .pipe(
      map(
        (res: IResponse<IProfile>) => {
          if(res.data) {
            this.tokenService.setPreferenceValue('account', JSON.stringify(res.data));
          }
          return res;
        }
      )
    );
  }

  resendCode(email: string, acctType: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/auth/resend-token?email=${email}&acctType=${acctType}`);
  }

  async logout(): Promise<void> {
    this.tokenService.removeToken()
  }
}
