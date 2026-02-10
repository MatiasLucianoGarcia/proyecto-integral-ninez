import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../login/data/user-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';

@Component({
    selector: 'app-help-page',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatExpansionModule,
        MatButtonModule,
        NavBarComponent,
        MatSidenavModule,
        SidebarComponent
    ],
    template: `
    <app-nav-bar (menuClick)="toggleSidebar()"></app-nav-bar>
    <mat-drawer-container class="dashboard-container" autosize>
        <mat-drawer #drawer class="dashboard-sidenav" [opened]="showSidebar()" mode="side">
            <app-sidebar></app-sidebar>
        </mat-drawer>

        <div class="page-content-wrapper">
             
             <div class="scrollable-content">
                <!-- Hero Header -->
                <header class="hero-header">
                    <div class="hero-content">
                        <div class="hero-icon-circle">
                            <mat-icon class="hero-icon">verified_user</mat-icon>
                        </div>
                        <h1 class="hero-title">Bienvenido a BBSIN</h1>
                        <p class="hero-subtitle">Sistema Integral de Niñez y Adolescencia</p>
                    </div>
                    <div class="hero-wave">
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path fill="#f8fafc" fill-opacity="1" d="M0,224L60,229.3C120,235,240,245,360,245.3C480,245,600,235,720,212.7C840,191,960,179,1080,168C1200,157,1320,157,1380,157L1440,157L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                        </svg>
                    </div>
                </header>

                <div class="content-wrapper">
                    <!-- Intro Section -->
                    <div class="intro-section fade-in-up">
                        <h2 class="section-heading">Propósito del Sistema</h2>
                        <p class="intro-text">
                            <strong>BBSIN</strong> es la plataforma centralizada diseñada para optimizar el registro, seguimiento y restitución de derechos de niños, niñas y adolescentes. 
                            A través de herramientas de análisis y gestión operativa, facilitamos la toma de decisiones informadas para los equipos de intervención.
                        </p>
                        <div class="role-badge-container">
                             <span class="role-label">Tu Perfil Actual:</span>
                             <span class="role-chip" [ngClass]="getRoleClass()">{{ userRole }}</span>
                        </div>
                    </div>

                    <!-- Layout de Tarjetas (Grid) en lugar de Acordeón -->
                    
                    <!-- ADMIN CONTENT -->
                    <div *ngIf="isRole('Administrador')" class="grid-container fade-in-delayed">
                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>dashboard</mat-icon></div>
                            <h3>Tablero de Control</h3>
                            <p>
                                Accede a una visión global del estado de situación mediante alertas en tiempo real. Permite identificar rápidamente grupos de personas en situaciones críticas, como falta de seguimiento, condiciones de vida desfavorables o indicadores educativos y de derechos vulnerados.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>notifications_active</mat-icon></div>
                            <h3>Alertas y Casos Asociados</h3>
                            <p>
                                Visualiza la cantidad de personas que cumplen con determinadas condiciones definidas por el sistema. Cada alerta permite acceder al listado completo de personas que la componen, facilitando el análisis individual a partir de datos agregados.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon green-icon"><mat-icon>groups</mat-icon></div>
                            <h3>Gestión Integral de Personas</h3>
                            <p>
                                Permite buscar personas dentro del sistema y acceder a la totalidad de su información registrada. Incluye datos generales, composición familiar, información de salud y educación, datos relevantes, articulaciones institucionales, condiciones de vida y registros de servicio local.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon purple-icon"><mat-icon>support_agent</mat-icon></div>
                            <h3>Servicio Local</h3>
                            <p>
                                Acceso completo a la información de servicio local. Permite visualizar, registrar y editar intervenciones, seguimientos y cualquier dato asociado al trabajo territorial o institucional realizado con cada persona.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>school</mat-icon></div>
                            <h3>Reporte de Escolaridad</h3>
                            <p>
                                Presenta información estadística sobre la situación educativa de las personas registradas. Los gráficos son interactivos y permiten acceder al listado de personas que representan cada indicador. Incluye filtros por edad, año, género y nacionalidad.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>cottage</mat-icon></div>
                            <h3>Reporte de Condiciones de Vida</h3>
                            <p>
                                Muestra indicadores relacionados con el contexto habitacional y socioeconómico. Desde cada gráfico es posible acceder al detalle de las personas representadas. Permite aplicar filtros por edad, género y nacionalidad para un análisis más específico.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon green-icon"><mat-icon>gavel</mat-icon></div>
                            <h3>Reporte de Derechos Vulnerados</h3>
                            <p>
                                Brinda una visión estadística sobre los derechos vulnerados registrados en el sistema. Los gráficos permiten acceder al listado de personas asociadas y aplicar filtros por edad, año, género y nacionalidad.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon purple-icon"><mat-icon>manage_accounts</mat-icon></div>
                            <h3>Administración de Usuarios</h3>
                            <p>
                                Permite crear, editar y eliminar usuarios del sistema, así como asignar roles y gestionar permisos de acceso.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>settings</mat-icon></div>
                            <h3>Configuración del Sistema</h3>
                            <p>
                                Habilita la administración de datos maestros y catálogos del sistema, incluyendo géneros, nacionalidades, parentescos, tipos de vivienda, efectores, derechos, programas y equipos locales.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>account_circle</mat-icon></div>
                            <h3>Perfil de Usuario</h3>
                            <p>
                                Permite al administrador visualizar su información personal y cambiar su contraseña.
                            </p>
                        </div>
                    </div>

                    <!-- PROTECTION CONTENT -->
                    <div *ngIf="isRole('Proteccion')" class="grid-container fade-in-delayed">
                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>dashboard</mat-icon></div>
                            <h3>Tablero de Control</h3>
                            <p>
                                Accede a alertas que muestran la cantidad de personas en distintas situaciones relevantes para el trabajo de protección. Permite aplicar filtros etarios y consultar los casos individuales asociados a cada alerta.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>notifications_active</mat-icon></div>
                            <h3>Alertas y Casos Asociados</h3>
                            <p>
                                Cada alerta funciona como un acceso directo al listado de personas que requieren seguimiento o intervención, facilitando la priorización del trabajo diario.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon green-icon"><mat-icon>groups</mat-icon></div>
                            <h3>Gestión Integral de Personas</h3>
                            <p>
                                Permite buscar personas y acceder a toda su información registrada en el sistema, incluyendo datos generales, familia, salud y educación, datos importantes, articulaciones, condiciones de vida y servicio local. También permite cargar y editar estos datos.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon purple-icon"><mat-icon>support_agent</mat-icon></div>
                            <h3>Servicio Local</h3>
                            <p>
                                Acceso completo a la información de servicio local. Permite registrar y actualizar intervenciones, seguimientos y acciones realizadas en el marco del servicio local.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>insights</mat-icon></div>
                            <h3>Reportes</h3>
                            <p>
                                Acceso a los reportes de Escolaridad, Condiciones de Vida y Derechos Vulnerados. Los gráficos son interactivos y permiten acceder al listado de personas representadas, aplicando filtros por edad, año (cuando corresponde), género y nacionalidad.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>account_circle</mat-icon></div>
                            <h3>Perfil de Usuario</h3>
                            <p>
                                Permite visualizar la información personal del usuario y cambiar la contraseña de acceso al sistema.
                            </p>
                        </div>
                    </div>

                    <!-- PROMOTION CONTENT -->
                    <div *ngIf="isRole('Promocion')" class="grid-container fade-in-delayed">
                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>dashboard</mat-icon></div>
                            <h3>Tablero de Control</h3>
                            <p>
                                Accede a una visión general de alertas relacionadas con situaciones relevantes para acciones de promoción y prevención. Permite aplicar filtros etarios y consultar los casos asociados a cada alerta.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>notifications_active</mat-icon></div>
                            <h3>Alertas y Casos Asociados</h3>
                            <p>
                                Las alertas permiten identificar grupos de personas que cumplen determinadas condiciones, facilitando la planificación de acciones de promoción. Se puede acceder al listado de personas que componen cada alerta.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon green-icon"><mat-icon>groups</mat-icon></div>
                            <h3>Gestión de Personas</h3>
                            <p>
                                Permite buscar personas y acceder a información general, familiar, de salud y educación, datos importantes, articulaciones y condiciones de vida. Desde esta sección se pueden cargar y editar estos datos.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon purple-icon"><mat-icon>visibility</mat-icon></div>
                            <h3>Información de Servicio Local (Vista Restringida)</h3>
                            <p>
                                Permite únicamente visualizar si una persona se encuentra vinculada al servicio local y la fecha del último registro realizado. No habilita el acceso al detalle ni la edición de información de servicio local.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon blue-icon"><mat-icon>school</mat-icon></div>
                            <h3>Reporte de Escolaridad</h3>
                            <p>
                                Presenta gráficos interactivos sobre la situación educativa. Permite acceder al listado de personas representadas y aplicar filtros por edad, año, género y nacionalidad.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon orange-icon"><mat-icon>cottage</mat-icon></div>
                            <h3>Reporte de Condiciones de Vida</h3>
                            <p>
                                Muestra indicadores agregados sobre condiciones de vida. Los gráficos permiten acceder al detalle de las personas representadas y aplicar filtros por edad, género y nacionalidad.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon green-icon"><mat-icon>gavel</mat-icon></div>
                            <h3>Reporte de Derechos Vulnerados</h3>
                            <p>
                                Presenta información estadística agregada sobre derechos vulnerados. No permite acceder al listado de personas asociadas a cada gráfico. Incluye filtros por edad, año, género y nacionalidad.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="card-icon purple-icon"><mat-icon>account_circle</mat-icon></div>
                            <h3>Perfil de Usuario</h3>
                            <p>
                                Permite visualizar la información personal y cambiar la contraseña.
                            </p>
                        </div>
                    </div>



                </div>
             </div>
        </div>
    </mat-drawer-container>
  `,
    styles: [`
    .dashboard-container {
        height: calc(100vh - 64px); /* Subtract navbar height */
        width: 100%;
        background-color: #f8fafc;
    }
    
    .dashboard-sidenav {
        width: 280px;
        max-width: 280px;
        min-width: 280px;
        background-color: #ffffff; /* Using explicit white or variable if available */
        border-right: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        overflow-y: auto;
    }

    .page-content-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .scrollable-content {
        flex: 1;
        overflow-y: auto;
    }

    /* HERO HEADER REFINADO */
    .hero-header {
        background: linear-gradient(to right, #3b82f6 0%, #1e3a8a 100%);
        color: white;
        padding: 3rem 2rem 14rem 2rem; /* Increased again to fit subtitle */
        position: relative;
        text-align: center;
        overflow: hidden;
    }

    .hero-title {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        letter-spacing: -1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .hero-subtitle {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.95); /* Más opaco */
        font-weight: 500; /* Un poco más de peso */
        letter-spacing: 0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3); /* Sombra más fuerte */
        margin-top: 0.5rem;
    }

    .hero-icon-circle {
        background: rgba(255, 255, 255, 0.15);
        width: 90px;
        height: 90px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem auto;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255,255,255,0.2);
    }

    .hero-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
    }

    .hero-wave {
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        line-height: 0;
    }

    .content-wrapper {
        max-width: 1000px;
        margin: -6rem auto 4rem auto;
        padding: 0 2rem;
        position: relative;
        z-index: 20;
    }

    /* INTRO SECTION */
    .intro-section {
        background: white;
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        text-align: center;
        margin-bottom: 3rem;
    }

    .section-heading {
        color: #1e3a8a;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
    }

    .intro-text {
        font-size: 1.15rem;
        line-height: 1.8;
        color: #475569;
        margin-bottom: 2rem;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .role-badge-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e2e8f0;
    }

    .role-label {
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 1px;
    }

    .role-chip {
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.95rem;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .badge-admin { background: linear-gradient(135deg, #1e40af, #3b82f6); }
    .badge-protection { background: linear-gradient(135deg, #0369a1, #0ea5e9); }
    .badge-promotion { background: linear-gradient(135deg, #4f46e5, #6366f1); }
    .badge-default { background: #64748b; }


    /* GRID LAYOUT FOR CARDS -> CHANGED TO FLEX FOR CENTER ALIGNMENT */
    .grid-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center; /* This centers the items in the last row */
        gap: 2rem;
    }

    .feature-card {
        flex: 1 1 300px; /* Grow, shrink, base 300px */
        max-width: 400px; /* Max width to keep them looking like cards */
        background: white;
        padding: 2.5rem 2rem;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Sombra sutil inicial */
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-top: 4px solid transparent;
        position: relative;
        overflow: hidden;
    }

    .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    .card-icon mat-icon {
        font-size: 30px;
        width: 30px;
        height: 30px;
    }

    .blue-icon { background: #eff6ff; color: #2563eb; }
    .green-icon { background: #f0fdf4; color: #16a34a; }
    .purple-icon { background: #f5f3ff; color: #7c3aed; }
    .orange-icon { background: #fff7ed; color: #ea580c; }

    .feature-card h3 {
        color: #1e293b;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .feature-card p {
        color: #64748b;
        line-height: 1.6;
        font-size: 1rem;
        margin: 0;
    }

    /* ANIMATIONS */
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }

    .hero-icon-circle {
        /* ... existing styles ... */
        animation: float 6s ease-in-out infinite; /* Restore floating animation */
    }

    /* ... existing styles ... */
    /* Remove .help-footer styles if no longer needed */

    .fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    .fade-in-delayed {
        animation: fadeInUp 0.8s ease-out 0.3s forwards;
        opacity: 0;
        transform: translateY(30px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
  `]
})
export class HelpPageComponent {
    private userDataService = inject(UserDataService);
    private dashboardSidebarService = inject(DashboardSidebarService);
    showSidebar() {
        return this.dashboardSidebarService.getInfo()();
    }

    toggleSidebar() {
        this.dashboardSidebarService.setInfo(!this.dashboardSidebarService.getInfo()());
    }

    userRole: string = '';

    constructor() {
        const user = this.userDataService.getUser();
        this.userRole = user?.rol?.nombre_rol || 'Usuario';
    }

    isRole(role: string): boolean {
        return this.userRole.toLowerCase().includes(role.toLowerCase());
    }

    getRoleClass() {
        const role = this.userRole.toLowerCase();
        if (role.includes('administrador')) return 'badge-admin';
        if (role.includes('proteccion') || role.includes('protección')) return 'badge-protection';
        if (role.includes('promocion') || role.includes('promoción')) return 'badge-promotion';
        return 'badge-default';
    }
}
