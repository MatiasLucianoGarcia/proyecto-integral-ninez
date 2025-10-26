import { Routes } from '@angular/router';

export const LOGIN_ROUTES: Routes = [
	{ path: '', loadComponent: () => import('./pages/login-access/login-access.component').then((m) => m.LoginAccessComponent) },
];
