import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['auth/login','geolocation-db.com','emer/latest/policy'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));
  if (isExcluded || req.method === 'GET') {
    return next(req);
  }
  var authToken = sessionStorage.getItem('EHL_TOKEN');
  if (authToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(clonedRequest);
  }
  return next(req);
};

