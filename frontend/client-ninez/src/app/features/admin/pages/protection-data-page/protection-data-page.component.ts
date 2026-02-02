import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminDataService } from '../../services/admin-data.service';
import { SimpleItemDialogComponent } from '../../components/simple-item-dialog/simple-item-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-protection-data-page',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTabsModule
    ],
    // Reuse styles
    styleUrl: '../users-page/users-page.component.scss',
    template: `
    <div class="page-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <mat-icon class="title-icon">security</mat-icon>
            <div>
              <h1 class="title">Protección y Promoción</h1>
              <p class="subtitle">Gestiona catálogos de derechos y programas</p>
            </div>
          </div>
        </div>
        
        <div class="header-actions">
             <button mat-flat-button class="add-button" (click)="openDialog()">
              <mat-icon>add</mat-icon>
              {{ getAddButtonLabel() }}
            </button>
        </div>
      </div>

      <mat-tab-group class="custom-tabs" animationDuration="0ms" [(selectedIndex)]="currentTabIndex">
        
        <!-- Tab 0: Efectores -->
        <mat-tab label="Efectores">
          <ng-template matTabContent>
              <div class="tab-content pt-6"> 
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: efectores, icon: 'business', colorClass: '!bg-blue-100 !text-blue-600', subfield: 'area' }"></ng-container>
                </div>
              </div>
          </ng-template>
        </mat-tab>

        <!-- Tab 1: Derechos Vulnerados -->
        <mat-tab label="Derechos Vulnerados">
           <ng-template matTabContent>
              <div class="tab-content pt-6">
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: derechos, icon: 'gavel', colorClass: '!bg-red-100 !text-red-600' }"></ng-container>
                </div>
              </div>
           </ng-template>
        </mat-tab>

        <!-- Tab 2: Programas -->
        <mat-tab label="Programas">
            <ng-template matTabContent>
              <div class="tab-content pt-6">
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: programas, icon: 'assignment', colorClass: '!bg-teal-100 !text-teal-600', subfield: 'descripcion' }"></ng-container>
                </div>
              </div>
            </ng-template>
        </mat-tab>

      </mat-tab-group>
    </div>

    <!-- Reusable List Template -->
    <ng-template #itemListTpl let-items="items" let-icon="icon" let-colorClass="colorClass" let-subfield="subfield">
        <div class="entities-list">
            <div *ngFor="let item of items" class="user-card">
                <div class="user-info">
                    <div class="user-avatar" [ngClass]="colorClass">
                        <mat-icon>{{ icon }}</mat-icon>
                    </div>
                    <div class="user-details">
                        <h3>{{ item.nombre || item.descripcion }}</h3>
                        <!-- Optional subfield display -->
                        <p *ngIf="subfield && item[subfield]" class="text-xs text-gray-500 mt-1 uppercase font-semibold">
                            {{ item[subfield] }}
                        </p>
                    </div>
                </div>
                <div class="card-actions">
                    <button mat-icon-button [matMenuTriggerFor]="itemMenu">
                        <mat-icon>more_vert</mat-icon>
                    </button>
                </div>
                <mat-menu #itemMenu="matMenu">
                    <button mat-menu-item (click)="openDialog(item)">
                        <mat-icon color="primary">edit</mat-icon>
                        <span>Editar</span>
                    </button>
                    <button mat-menu-item (click)="deleteItem(item)">
                        <mat-icon color="warn">delete</mat-icon>
                        <span>Eliminar</span>
                    </button>
                </mat-menu>
            </div>
            
            <div *ngIf="items.length === 0" class="empty-state">
                <mat-icon>list</mat-icon>
                <h3>No hay registros</h3>
                <p>No se encontraron datos para esta categoría.</p>
            </div>
        </div>
    </ng-template>
    `
})
export class ProtectionDataPageComponent implements OnInit {
    private adminDataService = inject(AdminDataService);
    private dialog = inject(MatDialog);

    efectores: any[] = [];
    derechos: any[] = [];
    programas: any[] = [];

    currentTabIndex = 0;

    ngOnInit() {
        this.loadAllData();
    }

    loadAllData() {
        this.adminDataService.getEfectores().subscribe(data => this.efectores = data);
        this.adminDataService.getDerechosVulnerados().subscribe(data => this.derechos = data);
        this.adminDataService.getProgramas().subscribe(data => this.programas = data);
    }

    getAddButtonLabel(): string {
        switch (this.currentTabIndex) {
            case 0: return 'Nuevo Efector';
            case 1: return 'Nuevo Derecho';
            case 2: return 'Nuevo Programa';
            default: return 'Nuevo';
        }
    }

    openDialog(item?: any) {
        let title = '';
        let label = '';
        let secondaryField: { name: string, label: string } | undefined;

        // Note: For Derechos Vulnerados, we map 'descripcion' to 'nombre' in the dialog logic
        // because SimpleDialog expects a main field 'nombre'.
        // BUT, backend seeds say Derecho_vulnerado has 'descripcion' NOT 'nombre'.
        // So we must handle mapping here similar to TipoVivienda.

        switch (this.currentTabIndex) {
            case 0:
                title = 'Efector';
                label = 'Nombre del Efector';
                secondaryField = { name: 'area', label: 'Área' };
                break;
            case 1:
                title = 'Derecho Vulnerado';
                label = 'Descripción del Derecho';
                // Derecho has only description. We will map 'nombre' -> 'descripcion' in save
                // And populate 'nombre' from 'descripcion' when editing
                break;
            case 2:
                title = 'Programa';
                label = 'Nombre del Programa';
                secondaryField = { name: 'descripcion', label: 'Descripción' };
                break;
        }

        const dataItem = item ? { ...item } : undefined;

        // Fix for DerechoVulnerado which uses 'descripcion' as primary field
        if (this.currentTabIndex === 1 && dataItem) {
            dataItem.nombre = dataItem.descripcion;
        }

        const dialogRef = this.dialog.open(SimpleItemDialogComponent, {
            width: '500px',
            data: { title, label, item: dataItem, secondaryField },
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.saveItem(result, item?.id);
            }
        });
    }

    saveItem(data: any, id?: any) {
        let observable;
        const tab = this.currentTabIndex;

        // Map payload for DerechoVulnerado (nombre -> descripcion)
        if (tab === 1) {
            data = { descripcion: data.nombre };
        }

        if (tab === 0) observable = id ? this.adminDataService.updateEfector(id, data) : this.adminDataService.createEfector(data);
        else if (tab === 1) observable = id ? this.adminDataService.updateDerechoVulnerado(id, data) : this.adminDataService.createDerechoVulnerado(data);
        else if (tab === 2) observable = id ? this.adminDataService.updatePrograma(id, data) : this.adminDataService.createPrograma(data);

        if (observable) {
            observable.subscribe({
                next: () => this.loadAllData(),
                error: (err) => console.error("Error saving data:", err)
            });
        }
    }

    deleteItem(item: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Eliminar Registro',
                message: `¿Estás seguro de eliminar "${item.nombre || item.descripcion}"?`,
                confirmText: 'Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                let observable;
                const tab = this.currentTabIndex;
                const id = item.id;

                if (tab === 0) observable = this.adminDataService.deleteEfector(id);
                else if (tab === 1) observable = this.adminDataService.deleteDerechoVulnerado(id);
                else if (tab === 2) observable = this.adminDataService.deletePrograma(id);

                if (observable) {
                    observable.subscribe({
                        next: () => this.loadAllData(),
                        error: (err) => console.error("Error deleting data:", err)
                    });
                }
            }
        });
    }
}
