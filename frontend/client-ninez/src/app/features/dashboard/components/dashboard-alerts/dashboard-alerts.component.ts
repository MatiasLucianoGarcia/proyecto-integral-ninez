import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AlertCardComponent } from '../alert-card/alert-card.component';
import { ReportesService } from '../../../../services/reportes.service';
import { DrillDownDialogComponent } from '../drill-down-dialog/drill-down-dialog.component';

@Component({
    selector: 'app-dashboard-alerts',
    standalone: true,
    imports: [
        CommonModule,
        AlertCardComponent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
    ],
    template: `
    <div class="alerts-section">
        <div class="section-header-card">
            <div class="header-content">
                <div class="title-row">
                    <mat-icon class="header-icon">notification_important</mat-icon>
                    <h2 class="section-title">Alertas Prioritarias</h2>
                </div>
                <div class="global-filter">
                    <span class="filter-label">Filtro de Edad:</span>
                    <div class="age-inputs">
                        <input class="age-input" type="number" [(ngModel)]="minEdad" (change)="reloadAlerts()" min="0" max="100" placeholder="0">
                        <span class="sep">a</span>
                        <input class="age-input" type="number" [(ngModel)]="maxEdad" (change)="reloadAlerts()" min="0" max="100" placeholder="21">
                        <span class="unit">años</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="alerts-grid">
            <!-- Alerta 1: Sin Familia -->
            <app-alert-card 
                title="Sin Vínculos Familiares" 
                subtitle="Personas sin familia registrada"
                icon="family_restroom"
                [count]="alertsData()?.sin_familia || 0" 
                [loading]="loading()"
                (cardClick)="openDrillDown('ALERTA_SIN_FAMILIA', 'Personas sin familia asociada')">
            </app-alert-card>

            <!-- Alerta 2: Sin Movimientos -->
            <app-alert-card 
                title="Sin Seguimiento Reciente" 
                subtitle="Sin movimientos en más de 15 días"
                icon="history"
                [count]="alertsData()?.sin_movimientos || 0" 
                [loading]="loading()"
                (cardClick)="openDrillDown('ALERTA_SIN_MOVIMIENTOS', 'Personas en Servicio Local sin movimientos recenties')">
            </app-alert-card>

            <!-- Alerta 3: Desactualizados -->
            <app-alert-card 
                title="Datos Desactualizados" 
                subtitle="Sin movimientos en más de un año"
                icon="update"
                [count]="alertsData()?.desactualizados || 0" 
                [loading]="loading()"
                (cardClick)="openDrillDown('ALERTA_DESACTUALIZADOS', 'Personas con datos desactualizados')">
            </app-alert-card>
        </div>
    </div>
  `,
    styles: [`
    .alerts-section {
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .section-header-card {
        background: linear-gradient(to right, rgb(37, 99, 235), rgb(30, 64, 175));
        border-radius: 16px;
        padding: 1.5rem 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        color: white;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .header-icon {
        font-size: 28px;
        height: 28px;
        width: 28px;
        color: #bfdbfe;
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
        color: white;
        letter-spacing: -0.5px;
    }

    .global-filter {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.5rem 1rem;
        border-radius: 12px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .filter-label {
        font-size: 0.9rem;
        color: #eff6ff;
        font-weight: 500;
    }

    .age-inputs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .age-input {
        width: 50px;
        padding: 6px 4px;
        border: 1px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.9);
        border-radius: 6px;
        text-align: center;
        font-weight: 600;
        color: #1e3a8a;
        outline: none;
        transition: all 0.2s;
    }

    .age-input:focus {
        background: white;
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
    }

    .sep, .unit {
        font-size: 0.9rem;
        color: #dbeafe;
    }

    .alerts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
  `]
})
export class DashboardAlertsComponent implements OnInit {
    private reportesService = inject(ReportesService);
    private dialog = inject(MatDialog);

    alertsData = signal<any>(null);
    loading = signal<boolean>(true);

    // Global Filtros
    minEdad = 0;
    maxEdad = 21;

    ngOnInit() {
        this.reloadAlerts();
    }

    reloadAlerts() {
        this.loading.set(true);
        // Ahora enviamos el filtro global a la API, que aplica a todas las alertas
        this.reportesService.getAlertas(this.minEdad, this.maxEdad).subscribe({
            next: (data) => {
                this.alertsData.set(data);
                this.loading.set(false);
            },
            error: (e) => {
                console.error('Error cargando alertas', e);
                this.loading.set(false);
            }
        });
    }

    openDrillDown(type: string, titleStr: string) {
        const filters: any = {
            minEdad: this.minEdad,
            maxEdad: this.maxEdad
        };

        // El backend ya sabe filtrar por edad para TODAS las alertas ahora.

        const displayTitle = `${titleStr} (${this.minEdad}-${this.maxEdad} años)`;

        this.reportesService.obtenerDetalle({
            tipo: type,
            filtros: filters
        }).subscribe(personas => {
            this.dialog.open(DrillDownDialogComponent, {
                width: '800px',
                data: {
                    title: displayTitle,
                    people: personas
                }
            });
        });
    }
}
