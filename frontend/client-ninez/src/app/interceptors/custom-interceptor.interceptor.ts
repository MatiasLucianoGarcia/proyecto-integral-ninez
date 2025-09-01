import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user'); 
  const authToken = user ? JSON.parse(user).token : null;

  if (!authToken) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return next(authReq);
};