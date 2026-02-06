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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DrillDownDialogComponent } from '../../components/drill-down-dialog/drill-down-dialog.component';
import { ReportesService } from '../../../../services/reportes.service';

@Component({
    selector: 'app-reporte-derechos-vulnerados',
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
        MatProgressSpinnerModule,
        MatTabsModule,
        MatDialogModule
    ],
    templateUrl: './reporte-derechos-vulnerados.component.html',
    styleUrls: ['./reporte-derechos-vulnerados.component.scss']
})
export class ReporteDerechosVulneradosComponent implements OnInit {
    private reportesService = inject(ReportesService);
    private dialog = inject(MatDialog);

    // Filtros
    anio = signal<number>(new Date().getFullYear());
    aniosDisponibles = signal<number[]>([]);
    minEdad = signal<number>(0);
    maxEdad = signal<number>(100);
    generosSeleccionados = signal<string[]>([]);
    nacionalidadesSeleccionadas = signal<string[]>([]);

    // Listas para filtros
    listaGeneros = signal<string[]>([]);
    listaNacionalidades = signal<string[]>([]);

    // Estado
    loading = signal<boolean>(false);
    datos = signal<any | null>(null);

    // Computados
    rankingGeneral = computed(() => this.datos()?.ranking_general || []);
    ageStats = computed(() => this.datos()?.por_edad || []);
    genderStats = computed(() => this.datos()?.por_genero || []);
    nationalityStats = computed(() => this.datos()?.por_nacionalidad || []);

    // Total de casos para calcular porcentajes en el ranking general
    totalCasos = computed(() => {
        // Si queremos el total de intervenciones, deberíamos traerlo del back o sumarlo.
        // Como un servicio puede tener 1 derecho (en este modelo simplificado), sumamos cantidades.
        const total = this.rankingGeneral().reduce((acc: number, curr: any) => acc + curr.cantidad, 0);
        return total > 0 ? total : 1; // Prevent division by zero
    });

    ngOnInit() {
        this.cargarListas();
        this.cargarAnios();
        this.cargarDatos();
    }

    cargarAnios() {
        this.reportesService.getAniosDerechosVulnerados().subscribe(anios => {
            this.aniosDisponibles.set(anios);
            if (anios.length > 0 && !anios.includes(this.anio())) {
                this.anio.set(anios[0]); // Seleccionar el más reciente si el actual no está
            }
        });
    }

    cargarListas() {
        this.reportesService.getGeneros().subscribe(res => {
            const generos = res.map(g => g.nombre);
            this.listaGeneros.set(generos);
            this.generosSeleccionados.set(generos);
        });
        this.reportesService.getNacionalidades().subscribe(res => {
            const nacionalidades = res.map(n => n.nombre);
            this.listaNacionalidades.set(nacionalidades);
            this.nacionalidadesSeleccionadas.set(nacionalidades);
        });
    }

    cargarDatos() {
        this.loading.set(true);
        const params = {
            anio: this.anio(),
            minEdad: this.minEdad(),
            maxEdad: this.maxEdad(),
            generos: this.generosSeleccionados(),
            nacionalidades: this.nacionalidadesSeleccionadas()
        };

        this.reportesService.getReporteDerechosVulnerados(params).subscribe({
            next: (res) => {
                this.datos.set(res.data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error cargando reporte de derechos vulnerados', err);
                this.loading.set(false);
            }
        });
    }

    onFilterChange() {
        this.cargarDatos();
    }

    // --- Utility Colors (Copied from Conditions Report) ---
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

    calculatePercentage(value: number, total: number): number {
        if (!total || total === 0) return 0;
        return (value / total) * 100;
    }

    // --- Drill Down ---
    verDetalle(scope: 'RANKING' | 'EDAD' | 'GENERO' | 'NACIONALIDAD', item: any, derechoEspecifico?: string) {
        const filtros: any = {
            derecho: derechoEspecifico,
            minEdad: this.minEdad(),
            maxEdad: this.maxEdad(),
            generos: this.generosSeleccionados().length === this.listaGeneros().length ? undefined : this.generosSeleccionados(),
            nacionalidades: this.nacionalidadesSeleccionadas().length === this.listaNacionalidades().length ? undefined : this.nacionalidadesSeleccionadas()
        };

        let tituloSuffix = '';

        if (scope === 'RANKING') {
            filtros.derecho = item.derecho;
            tituloSuffix = `Derecho: ${item.derecho}`;
        } else if (scope === 'EDAD') {
            filtros.minEdad = item.metadata.min;
            filtros.maxEdad = item.metadata.max;
            tituloSuffix = `Rango Edad ${item.rango}`;
        } else if (scope === 'GENERO') {
            filtros.genero = item.rango;
            tituloSuffix = `Género ${item.rango}`;
        } else if (scope === 'NACIONALIDAD') {
            filtros.nacionalidad = item.rango;
            tituloSuffix = `Nacionalidad ${item.rango}`;
        }

        // Si viene desde los graficos demograficos y se clickeo una barra especifica de un derecho (si implementamos detallado), agregamos ese filtro
        // Por ahora en demograficos mostramos "Principal", asi que podriamos filtrar por ESE derecho principal o mostrar todos los de ese grupo
        // En este diseño simplificado, al clickear la carta del grupo, mostramos TODOS los casos de ese grupo (ranking de derechos dentro del dialog?)
        // OJO: obtenerDetallePersonas filtra por derecho si se manda `derecho`. Si no se manda, devuelve todos los de ese grupo.
        // Para simplificar, si es demografico, mostramos todos los del grupo, y en info_adicional se ve qué derecho es.

        this.reportesService.obtenerDetalle({
            tipo: 'DERECHOS_VULNERADOS',
            anio: this.anio(),
            filtros
        }).subscribe(personas => {
            this.dialog.open(DrillDownDialogComponent, {
                width: '800px',
                data: {
                    title: `Detalle: ${tituloSuffix}`,
                    people: personas
                }
            });
        });
    }
}
