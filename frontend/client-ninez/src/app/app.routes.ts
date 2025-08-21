import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProtectionFormComponent } from './pages/protection-form/protection-form.component';

export const routes: Routes = [
    {component:LoginComponent, path:''},
    {component:LoginComponent,path:'login'},
    {component:ProtectionFormComponent, path:'formulario-carga'}
];
