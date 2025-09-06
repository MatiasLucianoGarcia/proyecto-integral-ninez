import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
	const token = localStorage.getItem('token');
	const authToken = token ? token : null;

	if (!authToken) return next(req);
	const authReq = req.clone({
		setHeaders: {
			Authorization: `Bearer ${authToken}`,
		},
	});

	return next(authReq);
};
