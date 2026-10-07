import { HttpInterceptorFn } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the request is going to Cloudinary or any third-party service
  if (req.url.includes('api.cloudinary.com')) {
    // Pass the request through WITHOUT attaching the Bearer token
    return next(req);
  }

  let targetUrl = req.url;
  if (Capacitor.getPlatform() === 'android') {
    targetUrl = targetUrl
      .replace('//localhost:4000', '//10.0.2.2:4000')
      .replace('//127.0.0.1:4000', '//10.0.2.2:4000');
  }

  const reqToForward = targetUrl !== req.url ? req.clone({ url: targetUrl }) : req;

  return from(
    Preferences.get({ key: 'access_token' })
  ).pipe(
    switchMap(({ value }) => {
      if (!value) {
        return next(reqToForward);
      }

      const authReq = reqToForward.clone({
        setHeaders: {
          authorization: `Bearer ${value}`
        }
      });

      return next(authReq);
    })
  );
};
