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
  minEdad = signal<number>(0);
  maxEdad = signal<number>(100);
  generosSeleccionados = signal<string[]>([]);
  nacionalidadesSeleccionadas = signal<string[]>([]);

  aniosDisponibles = signal<number[]>([]);
  datosReporte = signal<ReporteEscolaridadItem[]>([]); // Por edad
  generoStats = signal<any[]>([]);
  nationalityStats = signal<any[]>([]);
  loading = signal<boolean>(false);

  // Listas para filtros
  listaGeneros = signal<string[]>([]);
  listaNacionalidades = signal<string[]>([]);

  // Computados
  totalEscolarizados = computed(() => this.datosReporte().reduce((acc, curr) => acc + curr.escolarizados, 0));
  totalNoEscolarizados = computed(() => this.datosReporte().reduce((acc, curr) => acc + curr.no_escolarizados, 0));
  maxCantidad = computed(() => {
    return Math.max(...this.datosReporte().map(d => Math.max(d.escolarizados, d.no_escolarizados)), 1);
  });

  ngOnInit() {
    this.cargarListas();
    this.cargarAnios();
  }

  cargarListas() {
    this.reportesService.getGeneros().subscribe(res => {
      const generos = res.map(g => g.nombre);
      this.listaGeneros.set(generos);
      this.generosSeleccionados.set(generos); // Pre-seleccionar todos
      this.cargarDatos(); // Recargar datos iniciales con todo seleccionado
    });
    this.reportesService.getNacionalidades().subscribe(res => {
      const nacionalidades = res.map(n => n.nombre);
      this.listaNacionalidades.set(nacionalidades);
      this.nacionalidadesSeleccionadas.set(nacionalidades); // Pre-seleccionar todos
      this.cargarDatos(); // Recargar datos iniciales con todo seleccionado
    });
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
    this.reportesService.getReporteEscolaridad(
      this.anioSeleccionado(),
      this.minEdad(),
      this.maxEdad(),
      this.generosSeleccionados(),
      this.nacionalidadesSeleccionadas()
    )
      .subscribe({
        next: (response) => {
          this.datosReporte.set(response.data.por_edad);
          this.generoStats.set(response.data.por_genero);
          this.nationalityStats.set(response.data.por_nacionalidad);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando reporte escolaridad', err);
          this.loading.set(false);
        }
      });
  }

  onFilterChange() {
    this.cargarDatos();
  }

  // Helpers para el gráfico
  getBarHeight(value: number): string {
    const max = this.maxCantidad();
    if (max === 0) return '0%';
    return (value / max * 100) + '%';
  }

  // Método helper para reutilizar en nuevos gráficos (si needed)
  getMaxFromStats(stats: any[]): number {
    if (!stats || stats.length === 0) return 1;
    return Math.max(...stats.map(d => Math.max(d.escolarizados, d.no_escolarizados)), 1);
  }

  getBarHeightFor(value: number, stats: any[]): string {
    const max = this.getMaxFromStats(stats);
    return (value / max * 100) + '%';
  }
}
