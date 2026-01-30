import { Component, OnInit, ViewChild, inject, input, signal, effect, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HojaRutaService } from '../../services/hoja-ruta.service';
import { HojaRuta } from '../../domain/hoja-ruta.model';
import { ServicioLocalService } from '../../services/servicio-local.service';
import { EquipoLocal } from '../../domain/servicio-local.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddHojaRutaDialogComponent } from '../add-hoja-ruta-dialog/add-hoja-ruta-dialog.component';

// Custom Paginator Intl for Spanish
@Injectable()
export class HojaRutaPaginatorIntl extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Ítems por página:';
    override nextPageLabel = 'Siguiente página';
    override previousPageLabel = 'Página anterior';

    override getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
}

@Component({
    selector: 'app-hoja-ruta-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './hoja-ruta-list.component.html',
    styleUrls: ['./hoja-ruta-list.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useClass: HojaRutaPaginatorIntl }]
})
export class HojaRutaListComponent {
    private hojaRutaService = inject(HojaRutaService);
    private servicioLocalService = inject(ServicioLocalService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    dni = input.required<number | string>();
    isViewMode = input<boolean>(false);

    dataSource = new MatTableDataSource<HojaRuta>([]);
    displayedColumns: string[] = ['servicio', 'fecha', 'actividad', 'resultado', 'acciones'];

    equiposMap = new Map<number, string>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;



    loading = signal<boolean>(false);

    constructor() {
        this.loadEquipos();
        effect(() => {
            const currentDni = this.dni();
            if (currentDni) {
                this.loadData(Number(currentDni));
            }
        });
    }

    loadEquipos(): void {
        this.servicioLocalService.getEquiposLocales().subscribe({
            next: (data) => {
                data.forEach(e => this.equiposMap.set(e.id, e.nombre));
            },
            error: (err) => console.error('Error loading equipos', err)
        });
    }

    getEquipoName(id: number): string {
        return this.equiposMap.get(id) || `Equipo #${id}`;
    }

    loadData(dni: number): void {
        this.loading.set(true);
        this.hojaRutaService.getHojasRutaByDni(dni).subscribe({
            next: (data) => {
                this.dataSource.data = data;
                // Re-assign paginator if data loads after view init
                if (this.paginator) {
                    this.dataSource.paginator = this.paginator;
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading hoja de ruta', err);
                this.loading.set(false);
            }
        });
    }

    // Ensure paginator is linked when view is initialized and paginator is ready
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(AddHojaRutaDialogComponent, {
            width: '600px',
            data: { dni: Number(this.dni()) },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createHojaRuta(result);
            }
        });
    }

    createHojaRuta(data: any): void {
        this.loading.set(true);
        this.hojaRutaService.createHojaRuta(data).subscribe({
            next: () => {
                this.snackBar.open('Registro de hoja de ruta creado correctamente', 'Cerrar', { duration: 3000 });
                this.loadData(Number(this.dni()));
            },
            error: (err) => {
                console.error('Error creating hoja ruta', err);
                this.snackBar.open('Error al crear registro de hoja de ruta', 'Cerrar', { duration: 3000 });
                this.loading.set(false);
            }
        });
    }

    deleteHojaRuta(item: HojaRuta): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Eliminar Registro',
                message: '¿Está seguro de eliminar este registro de la hoja de ruta?',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading.set(true);
                this.hojaRutaService.deleteHojaRuta(item.id).subscribe({
                    next: () => {
                        this.snackBar.open('Registro eliminado correctamente', 'Cerrar', { duration: 3000 });
                        this.loadData(Number(this.dni()));
                    },
                    error: (err) => {
                        console.error('Error deleting hoja ruta', err);
                        this.snackBar.open('Error al eliminar registro', 'Cerrar', { duration: 3000 });
                        this.loading.set(false);
                    }
                });
            }
        });
    }
}


