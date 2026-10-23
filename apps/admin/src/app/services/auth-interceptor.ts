import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the request is going to Cloudinary or any third-party service
  if (req.url.includes('api.cloudinary.com')) {
    // Pass the request through WITHOUT attaching the Bearer token
    return next(req);
  }

  const targetUrl = req.url;

  const reqToForward = targetUrl !== req.url ? req.clone({ url: targetUrl }) : req;
  const token = sessionStorage.getItem('token');

  if(!token) {
    return next(reqToForward);
  } else {
    const authReq = reqToForward.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });

      return next(authReq);
  }
};