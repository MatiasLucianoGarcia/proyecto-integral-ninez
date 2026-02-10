import { environment } from '@env/environment';
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
    data: {
        por_edad: ReporteEscolaridadItem[];
        por_genero: { label: string, escolarizados: number, no_escolarizados: number, total: number }[];
        por_nacionalidad: { label: string, escolarizados: number, no_escolarizados: number, total: number }[];
    }
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
        global: any;
        por_edad: any[];
        por_genero: any[];
        por_nacionalidad: any[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class ReportesService {
    private http = inject(HttpClient);
    // Asumimos que environment.apiUrl está definido, si no usaremos path relativo o hardcoded por ahora para asegurar
    private apiUrl = environment.apiUrl;

    getReporteEscolaridad(anio: number, minEdad: number = 0, maxEdad: number = 100, generos: string[] = [], nacionalidades: string[] = []): Observable<ReporteEscolaridadResponse> {
        let params = `?anio=${anio}&minEdad=${minEdad}&maxEdad=${maxEdad}`;
        if (generos && generos.length > 0) params += `&generos=${generos.join(',')}`;
        if (nacionalidades && nacionalidades.length > 0) params += `&nacionalidades=${nacionalidades.join(',')}`;

        return this.http.get<ReporteEscolaridadResponse>(`${this.apiUrl}/reportes/escolaridad${params}`);
    }

    getAniosDisponibles(): Observable<number[]> {
        return this.http.get<number[]>(`${this.apiUrl}/reportes/escolaridad/anios`);
    }

    getReporteCondicionesVida(filters: { minEdad?: number, maxEdad?: number, filtroSL?: string, idEquipo?: number, generos?: string[], nacionalidades?: string[] }): Observable<ReporteCondicionesVidaResponse> {
        let params = `?minEdad=${filters.minEdad || ''}&maxEdad=${filters.maxEdad || ''}`;
        if (filters.filtroSL) params += `&filtroSL=${filters.filtroSL}`;
        if (filters.idEquipo) params += `&idEquipo=${filters.idEquipo}`;
        if (filters.generos && filters.generos.length > 0) params += `&generos=${filters.generos.join(',')}`;
        if (filters.nacionalidades && filters.nacionalidades.length > 0) params += `&nacionalidades=${filters.nacionalidades.join(',')}`;

        return this.http.get<ReporteCondicionesVidaResponse>(`${this.apiUrl}/reportes/condiciones-vida${params}`);
    }

    getGeneros(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/generos`);
    }

    getNacionalidades(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/nacionalidades`);
    }

    getReporteDerechosVulnerados(filters: { anio?: number, minEdad?: number, maxEdad?: number, generos?: string[], nacionalidades?: string[] }): Observable<any> {
        let params = `?anio=${filters.anio || new Date().getFullYear()}&minEdad=${filters.minEdad || ''}&maxEdad=${filters.maxEdad || ''}`;
        if (filters.generos && filters.generos.length > 0) params += `&generos=${filters.generos.join(',')}`;
        if (filters.nacionalidades && filters.nacionalidades.length > 0) params += `&nacionalidades=${filters.nacionalidades.join(',')}`;

        return this.http.get<any>(`${this.apiUrl}/reportes/derechos-vulnerados${params}`);
    }

    getAniosDerechosVulnerados(): Observable<number[]> {
        return this.http.get<number[]>(`${this.apiUrl}/reportes/derechos-vulnerados/anios`);
    }

    obtenerDetalle(payload: { tipo: string, anio?: number, filtros: any }): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiUrl}/reportes/detalle`, payload);
    }

    getAlertas(minEdad: number = 0, maxEdad: number = 21): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/reportes/alertas?minEdad=${minEdad}&maxEdad=${maxEdad}`);
    }
}
