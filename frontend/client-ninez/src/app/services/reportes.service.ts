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
}
