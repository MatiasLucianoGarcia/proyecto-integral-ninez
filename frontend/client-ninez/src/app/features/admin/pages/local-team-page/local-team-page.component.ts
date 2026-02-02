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
    selector: 'app-local-team-page',
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
            <mat-icon class="title-icon">groups</mat-icon>
            <div>
              <h1 class="title">Equipo Local</h1>
              <p class="subtitle">Gestiona los equipos locales del sistema</p>
            </div>
          </div>
        </div>
        
        <div class="header-actions">
             <button mat-flat-button class="add-button" (click)="openDialog()">
              <mat-icon>add</mat-icon>
              Nuevo Equipo Local
            </button>
        </div>
      </div>

      <mat-tab-group class="custom-tabs" animationDuration="0ms">
        
        <!-- Tab 0: Equipo Local -->
        <mat-tab label="Equipo Local">
          <ng-template matTabContent>
              <div class="tab-content pt-6"> 
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: equipos, icon: 'diversity_3', colorClass: '!bg-indigo-100 !text-indigo-600' }"></ng-container>
                </div>
              </div>
          </ng-template>
        </mat-tab>

      </mat-tab-group>
    </div>

    <!-- Reusable List Template -->
    <ng-template #itemListTpl let-items="items" let-icon="icon" let-colorClass="colorClass">
        <div class="entities-list">
            <div *ngFor="let item of items" class="user-card">
                <div class="user-info">
                    <div class="user-avatar" [ngClass]="colorClass">
                        <mat-icon>{{ icon }}</mat-icon>
                    </div>
                    <div class="user-details">
                        <h3>{{ item.nombre }}</h3>
                        <p class="text-xs text-gray-400">ID: {{ item.id }}</p>
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
                <p>No se encontraron equipos locales.</p>
            </div>
        </div>
    </ng-template>
    `
})
export class LocalTeamPageComponent implements OnInit {
    private adminDataService = inject(AdminDataService);
    private dialog = inject(MatDialog);

    equipos: any[] = [];

    ngOnInit() {
        this.loadAllData();
    }

    loadAllData() {
        this.adminDataService.getEquiposLocales().subscribe(data => this.equipos = data);
    }

    openDialog(item?: any) {
        const dialogRef = this.dialog.open(SimpleItemDialogComponent, {
            width: '500px',
            data: {
                title: 'Equipo Local',
                label: 'Nombre del Equipo',
                item
            },
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.saveItem(result, item?.id);
            }
        });
    }

    saveItem(data: any, id?: any) {
        const observable = id ? this.adminDataService.updateEquipoLocal(id, data) : this.adminDataService.createEquipoLocal(data);

        observable.subscribe({
            next: () => this.loadAllData(),
            error: (err) => console.error("Error saving data:", err)
        });
    }

    deleteItem(item: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Eliminar Registro',
                message: `¿Estás seguro de eliminar "${item.nombre}"?`,
                confirmText: 'Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.adminDataService.deleteEquipoLocal(item.id).subscribe({
                    next: () => this.loadAllData(),
                    error: (err) => console.error("Error deleting data:", err)
                });
            }
        });
    }
}
