import { Routes } from '@angular/router';
import { SessionGuard } from './core/guards/session.guard';

export const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => import('./features/login/login.routes').then((m) => m.LOGIN_ROUTES),
	},
	{
		path: 'dashboard',
		canActivate: [SessionGuard],
		loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
	},
	{
		path: 'person-form',
		canActivate: [SessionGuard],
		loadComponent: () => import('./features/persons/components/person-form/person-form.component').then((m) => m.PersonFormComponent),
	},
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: '**', redirectTo: 'login' },
];
