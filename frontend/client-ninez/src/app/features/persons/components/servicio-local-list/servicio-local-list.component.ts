import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioLocalService } from '../../services/servicio-local.service';
import { ServicioLocal, CreateServicioLocal } from '../../domain/servicio-local.model';
import { AddServicioLocalDialogComponent } from '../add-servicio-local-dialog/add-servicio-local-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-servicio-local-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './servicio-local-list.component.html',
  styleUrl: './servicio-local-list.component.scss'
})
export class ServicioLocalListComponent {
  private servicioService = inject(ServicioLocalService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dni = input.required<number | string>();
  isViewMode = input<boolean>(false);

  items = signal<ServicioLocal[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const currentDni = this.dni();
      if (currentDni) {
        this.loadData(Number(currentDni));
      }
    });
  }

  loadData(dni: number): void {
    this.loading.set(true);
    this.servicioService.getServiciosLocalesByDni(dni).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading servicios locales', err);
        this.loading.set(false);
      }
    });
  }

  openAddDialog(): void {
    if (this.isViewMode()) return;

    const dialogRef = this.dialog.open(AddServicioLocalDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createServicioLocal(result);
      }
    });
  }

  createServicioLocal(data: any): void {
    const payload: CreateServicioLocal = {
      dni: Number(this.dni()),
      ...data
    };

    this.loading.set(true);
    this.servicioService.createServicioLocal(payload).subscribe({
      next: (newItem) => {
        this.items.update(current => [...current, newItem]);
        this.snackBar.open('Servicio local asociado correctamente', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
        // Reload to get joined names properly if backend didn't return them in CREATE response
        this.loadData(Number(this.dni()));
      },
      error: (err) => {
        console.error('Error creating servicio local', err);
        this.snackBar.open('Error al asociar servicio local', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }
  deleteServicioLocal(item: ServicioLocal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Intervención',
        message: '¿Está seguro de eliminar esta intervención?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading.set(true);
        this.servicioService.deleteServicioLocal(item.id).subscribe({
          next: () => {
            this.snackBar.open('Intervención eliminada correctamente', 'Cerrar', { duration: 3000 });
            this.items.update(current => current.filter(i => i.id !== item.id));
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error removing servicio local', err);
            this.snackBar.open('Error al eliminar intervención', 'Cerrar', { duration: 3000 });
            this.loading.set(false);
          }
        });
      }
    });
  }
}
