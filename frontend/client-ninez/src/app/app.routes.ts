import { Routes } from '@angular/router';
import { SessionGuard } from './core/guards/session.guard';

export const routes: Routes = [
	{ path: 'login', loadChildren: () => import('./features/login/login.routes').then((m) => m.LOGIN_ROUTES) },
	{
		path: '',
		canActivate: [SessionGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
			},
			// Aquí puedes agregar más rutas protegidas
		],
	},
	{ path: '**', redirectTo: 'login' },
];
