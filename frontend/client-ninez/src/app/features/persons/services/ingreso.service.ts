import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingreso, CreateIngreso } from '../domain/ingreso.model';

@Injectable({
    providedIn: 'root'
})
export class IngresoService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/ingreso';

    getAllIngresos(): Observable<Ingreso[]> {
        return this.http.get<Ingreso[]>(this.apiUrl);
    }

    getIngresosByDni(dni: number): Observable<Ingreso[]> {
        return this.http.get<Ingreso[]>(`${this.apiUrl}/dni/${dni}`);
    }

    createIngreso(ingreso: CreateIngreso): Observable<Ingreso> {
        return this.http.post<Ingreso>(this.apiUrl, ingreso);
    }

    deleteIngreso(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
