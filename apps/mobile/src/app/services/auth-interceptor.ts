import { HttpInterceptorFn } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the request is going to Cloudinary or any third-party service
  if (req.url.includes('api.cloudinary.com')) {
    // Pass the request through WITHOUT attaching the Bearer token
    return next(req);
  }
  
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
