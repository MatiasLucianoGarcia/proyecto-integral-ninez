import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actividad } from '../domain/actividad.model';

@Injectable({
    providedIn: 'root'
})
export class ActividadService {
    private apiUrl = 'http://localhost:8080/api/actividad';

    constructor(private http: HttpClient) { }

    getActividades(dni: number): Observable<Actividad[]> {
        return this.http.get<Actividad[]>(`${this.apiUrl}/${dni}`);
    }

    createActividad(actividad: Partial<Actividad>): Observable<Actividad> {
        return this.http.post<Actividad>(`${this.apiUrl}/`, actividad);
    }

    deleteActividad(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
