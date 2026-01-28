import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Perdida } from '../domain/perdida.model';

@Injectable({
    providedIn: 'root'
})
export class PerdidaService {
    private apiUrl = 'http://localhost:8080/api/perdida';

    constructor(private http: HttpClient) { }

    getPerdidas(dni: number): Observable<Perdida[]> {
        return this.http.get<Perdida[]>(`${this.apiUrl}/${dni}`);
    }

    createPerdida(perdida: Partial<Perdida>): Observable<Perdida> {
        return this.http.post<Perdida>(`${this.apiUrl}/`, perdida);
    }

    deletePerdida(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
