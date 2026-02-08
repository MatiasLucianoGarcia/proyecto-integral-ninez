import { Routes } from '@angular/router';
import { SessionGuard } from './core/guards/session.guard';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout.component';

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
		path: 'admin',
		canActivate: [SessionGuard],
		loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
	},
	{
		path: 'perfil',
		component: AdminLayoutComponent,
		canActivate: [SessionGuard],
		children: [
			{
				path: '',
				loadComponent: () => import('./features/profile/pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
			}
		]
	},
	{
		path: 'person-form',
		canActivate: [SessionGuard],
		loadComponent: () => import('./features/persons/components/person-form/person-form.component').then((m) => m.PersonFormComponent),
	},
	{
		path: 'reportes',
		component: AdminLayoutComponent, // Reusing AdminLayout for sidebar consistency
		children: [
			{
				path: 'escolaridad',
				loadComponent: () => import('./features/dashboard/pages/reporte-escolaridad/reporte-escolaridad.component').then(m => m.ReporteEscolaridadComponent)
			},
			{
				path: 'condiciones-vida',
				loadComponent: () => import('./features/dashboard/pages/reporte-condiciones-vida/reporte-condiciones-vida.component').then(m => m.ReporteCondicionesVidaComponent)
			},
			{
				path: 'derechos-vulnerados',
				loadComponent: () => import('./features/dashboard/pages/reporte-derechos-vulnerados/reporte-derechos-vulnerados.component').then(m => m.ReporteDerechosVulneradosComponent)
			},
			{ path: '', redirectTo: 'escolaridad', pathMatch: 'full' }
		]
	},
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: '**', redirectTo: 'login' },
];
