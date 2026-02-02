import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminDataService } from '../../services/admin-data.service';
import { SimpleItemDialogComponent } from '../../components/simple-item-dialog/simple-item-dialog.component';
import { ParentezcoDialogComponent } from '../../components/parentezco-dialog/parentezco-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-person-data-page',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTabsModule
    ],
    styleUrl: '../users-page/users-page.component.scss', // Reuse same styles
    template: `
    <div class="page-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <mat-icon class="title-icon">folder_shared</mat-icon>
            <div>
              <h1 class="title">Datos de Personas</h1>
              <p class="subtitle">Gestiona catálogos auxiliares del sistema</p>
            </div>
          </div>
        </div>
        
        <!-- Dynamic Action Button -->
        <div class="header-actions">
             <button mat-flat-button class="add-button" (click)="openDialog()">
              <mat-icon>add</mat-icon>
              {{ getAddButtonLabel() }}
            </button>
        </div>
      </div>

      <mat-tab-group class="custom-tabs" animationDuration="0ms" [(selectedIndex)]="currentTabIndex" (selectedIndexChange)="onTabChange()">
        
        <!-- Tab 0: Géneros -->
        <mat-tab label="Géneros">
          <ng-template matTabContent>
              <div class="tab-content pt-6"> 
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: generos, icon: 'face', colorClass: '!bg-blue-100 !text-blue-600' }"></ng-container>
                </div>
              </div>
          </ng-template>
        </mat-tab>

        <!-- Tab 1: Nacionalidades -->
        <mat-tab label="Nacionalidades">
           <ng-template matTabContent>
              <div class="tab-content pt-6">
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: nacionalidades, icon: 'public', colorClass: '!bg-green-100 !text-green-600' }"></ng-container>
                </div>
              </div>
           </ng-template>
        </mat-tab>

        <!-- Tab 2: Parentescos -->
        <mat-tab label="Parentescos">
            <ng-template matTabContent>
              <div class="tab-content pt-6">
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: parentezcos, icon: 'supervised_user_circle', colorClass: '!bg-purple-100 !text-purple-600' }"></ng-container>
                </div>
              </div>
            </ng-template>
        </mat-tab>

        <!-- Tab 3: Tipos de Vivienda -->
        <mat-tab label="Tipos de Vivienda">
            <ng-template matTabContent>
              <div class="tab-content pt-6">
                <div class="content-section">
                    <ng-container *ngTemplateOutlet="itemListTpl; context: { items: tiposVivienda, icon: 'home', colorClass: '!bg-orange-100 !text-orange-600' }"></ng-container>
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
                        <h3>{{ item.nombre || item.descripcion || item.tipo }}</h3>
                        <p class="text-xs text-gray-400">ID: {{ item.id }}</p>
                        <p *ngIf="item.nombre_inverso" class="text-xs text-gray-500 mt-1">Inverso: {{ item.nombre_inverso }}</p>
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
export class PersonDataPageComponent implements OnInit {
    private adminDataService = inject(AdminDataService);
    private dialog = inject(MatDialog);

    generos: any[] = [];
    nacionalidades: any[] = [];
    parentezcos: any[] = [];
    tiposVivienda: any[] = [];

    currentTabIndex = 0;

    ngOnInit() {
        this.loadAllData();
    }

    loadAllData() {
        this.adminDataService.getGeneros().subscribe(data => this.generos = data);
        this.adminDataService.getNacionalidades().subscribe(data => this.nacionalidades = data);
        this.adminDataService.getParentezcos().subscribe(data => {
            this.parentezcos = data.map((item: any) => ({
                ...item,
                nombre_inverso: data.find((p: any) => p.id === item.id_inverso)?.descripcion
            }));
        });
        this.adminDataService.getTiposVivienda().subscribe(data => this.tiposVivienda = data);
    }

    onTabChange() {
        // Optional: Refresh specific tab data if needed
    }

    getAddButtonLabel(): string {
        switch (this.currentTabIndex) {
            case 0: return 'Nuevo Género';
            case 1: return 'Nueva Nacionalidad';
            case 2: return 'Nuevo Parentesco';
            case 3: return 'Nuevo Tipo Vivienda';
            default: return 'Nuevo';
        }
    }

    openDialog(item?: any) {
        // Case 2: Parentescos (Special Dialog)
        if (this.currentTabIndex === 2) {
            const dialogRef = this.dialog.open(ParentezcoDialogComponent, {
                width: '500px',
                data: { item },
                panelClass: 'custom-dialog-container'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.saveItem(result, item?.id);
                }
            });
            return;
        }

        // Default Case: Simple Dialog
        let title = '';
        let label = '';

        switch (this.currentTabIndex) {
            case 0: title = 'Género'; label = 'Nombre del Género'; break;
            case 1: title = 'Nacionalidad'; label = 'Nombre de Nacionalidad'; break;
            // case 2 managed above
            case 3: title = 'Tipo Vivienda'; label = 'Nombre Tipo Vivienda'; break;
        }

        const dialogRef = this.dialog.open(SimpleItemDialogComponent, {
            width: '500px',
            data: { title, label, item: item ? { ...item, nombre: item.nombre || item.tipo } : undefined },
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

        if (tab === 0) observable = id ? this.adminDataService.updateGenero(id, data) : this.adminDataService.createGenero(data);
        else if (tab === 1) observable = id ? this.adminDataService.updateNacionalidad(id, data) : this.adminDataService.createNacionalidad(data);
        else if (tab === 2) observable = id ? this.adminDataService.updateParentezco(id, data) : this.adminDataService.createParentezco(data);
        else if (tab === 3) {
            const payload = { tipo: data.nombre };
            observable = id ? this.adminDataService.updateTipoVivienda(id, payload) : this.adminDataService.createTipoVivienda(payload);
        }

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
                message: `¿Estás seguro de eliminar "${item.nombre || item.descripcion || item.tipo}"?`,
                confirmText: 'Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                let observable;
                const tab = this.currentTabIndex;
                const id = item.id;

                if (tab === 0) observable = this.adminDataService.deleteGenero(id);
                else if (tab === 1) observable = this.adminDataService.deleteNacionalidad(id);
                else if (tab === 2) observable = this.adminDataService.deleteParentezco(id);
                else if (tab === 3) observable = this.adminDataService.deleteTipoVivienda(id);

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
