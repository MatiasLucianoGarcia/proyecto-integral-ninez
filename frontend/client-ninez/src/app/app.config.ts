import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { customInterceptorInterceptor } from './interceptors/custom-interceptor.interceptor';

registerLocaleData(localeEsAr, 'es-AR');

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(withFetch(), withInterceptors([customInterceptorInterceptor])),
		provideRouter(routes),
		{ provide: LOCALE_ID, useValue: 'es-AR' },
		{ provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
		provideNativeDateAdapter(),
	],
};
