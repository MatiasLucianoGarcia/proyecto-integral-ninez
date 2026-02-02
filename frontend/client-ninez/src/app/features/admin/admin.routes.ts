import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'usuarios',
                loadComponent: () => import('./pages/users-page/users-page.component').then(m => m.UsersPageComponent)
            },
            {
                path: 'datos-personas',
                loadComponent: () => import('./pages/person-data-page/person-data-page.component').then(m => m.PersonDataPageComponent)
            },
            {
                path: '',
                redirectTo: 'usuarios',
                pathMatch: 'full'
            }
        ]
    }
];
