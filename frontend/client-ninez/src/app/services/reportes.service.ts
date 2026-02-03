import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReporteEscolaridadItem {
    edad: number;
    escolarizados: number;
    no_escolarizados: number;
    total: number;
}

export interface ReporteEscolaridadResponse {
    anio: number;
    data: ReporteEscolaridadItem[];
}

export interface ReporteCondicionesVidaItem {
    rango: string;
    total_personas: number;
    porcentaje_sin_luz: number;
    porcentaje_sin_gas: number;
    porcentaje_sin_agua: number;
    porcentaje_sin_internet: number;
    vivienda_predominante: string;
    vivienda_predominante_porcentaje: number;
}

export interface ReporteCondicionesVidaResponse {
    data: {
        global: {
            total_personas: number;
            porcentaje_sin_luz: number;
            porcentaje_sin_gas: number;
            porcentaje_sin_agua: number;
            porcentaje_sin_internet: number;
            tipos_vivienda: Record<string, number>;
        };
        por_edad: ReporteCondicionesVidaItem[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class ReportesService {
    private http = inject(HttpClient);
    // Asumimos que environment.apiUrl está definido, si no usaremos path relativo o hardcoded por ahora para asegurar
    private apiUrl = 'http://localhost:8080/api';

    getReporteEscolaridad(anio?: number, minEdad?: number, maxEdad?: number): Observable<ReporteEscolaridadResponse> {
        let params = `?anio=${anio || ''}`;
        if (minEdad !== undefined) params += `&minEdad=${minEdad}`;
        if (maxEdad !== undefined) params += `&maxEdad=${maxEdad}`;

        return this.http.get<ReporteEscolaridadResponse>(`${this.apiUrl}/reportes/escolaridad${params}`);
    }

    getAniosDisponibles(): Observable<number[]> {
        return this.http.get<number[]>(`${this.apiUrl}/reportes/escolaridad/anios`);
    }

    getReporteCondicionesVida(filters: { minEdad?: number, maxEdad?: number, filtroSL?: string, idEquipo?: number }): Observable<ReporteCondicionesVidaResponse> {
        let params = `?minEdad=${filters.minEdad || ''}&maxEdad=${filters.maxEdad || ''}`;
        if (filters.filtroSL) params += `&filtroSL=${filters.filtroSL}`;
        if (filters.idEquipo) params += `&idEquipo=${filters.idEquipo}`;

        return this.http.get<ReporteCondicionesVidaResponse>(`${this.apiUrl}/reportes/condiciones-vida${params}`);
    }
}
