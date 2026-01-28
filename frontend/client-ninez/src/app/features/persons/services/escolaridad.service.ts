import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Escolaridad } from '../domain/escolaridad.model';

@Injectable({
    providedIn: 'root',
})
export class EscolaridadService {
    private http: HttpClient = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/escolaridades';

    constructor() { }

    getEscolaridades(dni: number): Observable<Escolaridad[]> {
        return this.http.get<Escolaridad[]>(`${this.apiUrl}/${dni}`);
    }

    createEscolaridad(escolaridad: Escolaridad): Observable<Escolaridad> {
        return this.http.post<Escolaridad>(this.apiUrl, escolaridad);
    }

    deleteEscolaridad(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
