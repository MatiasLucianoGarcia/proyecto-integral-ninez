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
import { ReportesService, ReporteCondicionesVidaResponse } from '../../../../services/reportes.service';

@Component({
  selector: 'app-reporte-condiciones-vida',
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
  templateUrl: './reporte-condiciones-vida.component.html',
  styleUrls: ['./reporte-condiciones-vida.component.scss']
})
export class ReporteCondicionesVidaComponent implements OnInit {
  private reportesService = inject(ReportesService);

  // Filtros
  minEdad = signal<number>(0);
  maxEdad = signal<number>(100);
  generosSeleccionados = signal<string[]>([]);
  nacionalidadesSeleccionadas = signal<string[]>([]);

  // Listas para filtros (cargadas dinámicamente)
  listaGeneros = signal<string[]>([]);
  listaNacionalidades = signal<string[]>([]);

  // Estado
  loading = signal<boolean>(false);
  datos = signal<ReporteCondicionesVidaResponse | null>(null);

  // Computados para template
  globalStats = computed(() => this.datos()?.data?.global);
  ageStats = computed(() => this.datos()?.data?.por_edad || []);
  genderStats = computed(() => this.datos()?.data?.por_genero || []);
  nationalityStats = computed(() => this.datos()?.data?.por_nacionalidad || []);

  ngOnInit() {
    this.cargarListas();
    this.cargarDatos();
  }

  cargarListas() {
    this.reportesService.getGeneros().subscribe(res => {
      const generos = res.map(g => g.nombre);
      this.listaGeneros.set(generos);
      this.generosSeleccionados.set(generos); // Pre-seleccionar todos
    });
    this.reportesService.getNacionalidades().subscribe(res => {
      const nacionalidades = res.map(n => n.nombre);
      this.listaNacionalidades.set(nacionalidades);
      this.nacionalidadesSeleccionadas.set(nacionalidades); // Pre-seleccionar todos
    });
  }

  cargarDatos() {
    this.loading.set(true);
    // Convert signal values to simple types for the service
    const params = {
      minEdad: this.minEdad(),
      maxEdad: this.maxEdad(),
      generos: this.generosSeleccionados(),
      nacionalidades: this.nacionalidadesSeleccionadas()
    };

    this.reportesService.getReporteCondicionesVida(params).subscribe({
      next: (res) => {
        this.datos.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reporte de condiciones de vida', err);
        this.loading.set(false);
      }
    });
  }

  onFilterChange() {
    this.cargarDatos();
  }

  getColorForPercentage(percentage: number | undefined): string {
    if (percentage === undefined || percentage === null) return 'rgb(37, 99, 235)'; // Default Blue

    // Clamp percentage 0-100
    const p = Math.min(Math.max(percentage, 0), 100) / 100;

    // Interpolate between Blue (37, 99, 235) and Red (239, 68, 68)
    const r = Math.round(37 + (239 - 37) * p);
    const g = Math.round(99 + (68 - 99) * p);
    const b = Math.round(235 + (68 - 235) * p);

    return `rgb(${r}, ${g}, ${b})`;
  }
}
