import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportesService, ReporteEscolaridadItem } from '../../../../services/reportes.service';

@Component({
  selector: 'app-reporte-escolaridad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reporte-escolaridad.component.html',
  styleUrls: ['./reporte-escolaridad.component.scss']
})
export class ReporteEscolaridadComponent implements OnInit {
  private reportesService = inject(ReportesService);

  // Estado
  anioSeleccionado = signal<number>(new Date().getFullYear());
  minEdad = signal<number>(5);
  maxEdad = signal<number>(21);
  aniosDisponibles = signal<number[]>([]);
  datosReporte = signal<ReporteEscolaridadItem[]>([]);
  loading = signal<boolean>(false);

  // Computados
  totalEscolarizados = computed(() => this.datosReporte().reduce((acc, curr) => acc + curr.escolarizados, 0));
  totalNoEscolarizados = computed(() => this.datosReporte().reduce((acc, curr) => acc + curr.no_escolarizados, 0));
  maxCantidad = computed(() => {
    return Math.max(...this.datosReporte().map(d => Math.max(d.escolarizados, d.no_escolarizados)), 1);
  });

  ngOnInit() {
    this.cargarAnios();
  }

  cargarAnios() {
    this.reportesService.getAniosDisponibles().subscribe({
      next: (anios) => {
        if (anios.length > 0) {
          this.aniosDisponibles.set(anios);
          const current = this.anioSeleccionado();
          if (!anios.includes(current)) {
            this.anioSeleccionado.set(anios[0]);
          }
        } else {
          const currentYear = new Date().getFullYear();
          this.aniosDisponibles.set([currentYear]);
          this.anioSeleccionado.set(currentYear);
        }
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error cargando años disponibles', err);
        const currentYear = new Date().getFullYear();
        this.aniosDisponibles.set([currentYear]);
        this.cargarDatos();
      }
    });
  }

  cargarDatos() {
    this.loading.set(true);
    this.reportesService.getReporteEscolaridad(this.anioSeleccionado(), this.minEdad(), this.maxEdad())
      .subscribe({
        next: (response) => {
          this.datosReporte.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando reporte', err);
          this.loading.set(false);
        }
      });
  }

  onFilterChange() {
    this.cargarDatos();
  }

  // Helpers para el gráfico
  getBarHeight(valor: number): string {
    const max = this.maxCantidad();
    // Altura máxima del gráfico digamos 200px
    const percentage = (valor / max) * 100;
    return `${percentage}%`;
  }
}
