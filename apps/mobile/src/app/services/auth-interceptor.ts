import { HttpInterceptorFn } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(
    Preferences.get({ key: 'access_token' })
  ).pipe(
    switchMap(({ value }) => {
      if (!value) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: {
          authorization: `Bearer ${value}`
        }
      });

      return next(authReq);
    })
  );
};
