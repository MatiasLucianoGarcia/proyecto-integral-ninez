import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { ReporteCondicionesVidaComponent } from './pages/reporte-condiciones-vida/reporte-condiciones-vida.component';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'ayuda',
        loadComponent: () => import('./pages/help-page/help-page.component').then(m => m.HelpPageComponent)
    },
    {
        path: 'reportes/escolaridad',
        loadComponent: () => import('./pages/reporte-escolaridad/reporte-escolaridad.component').then(m => m.ReporteEscolaridadComponent)
    },
    {
        path: 'reportes/condiciones-vida',
        loadComponent: () => import('./pages/reporte-condiciones-vida/reporte-condiciones-vida.component').then(m => m.ReporteCondicionesVidaComponent)
    },
    {
        path: 'reportes/derechos-vulnerados',
        loadComponent: () => import('./pages/reporte-derechos-vulnerados/reporte-derechos-vulnerados.component').then(m => m.ReporteDerechosVulneradosComponent)
    }
];
