import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CondicionesVida } from '../domain/condiciones-vida.model';

@Injectable({
    providedIn: 'root'
})
export class CondicionesVidaService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/condicionesVida';

    getCondicionesVida(dni: number): Observable<CondicionesVida> {
        return this.http.get<CondicionesVida>(`${this.apiUrl}/${dni}`);
    }

    updateCondicionesVida(dni: number, data: Partial<CondicionesVida>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${dni}`, data);
    }
}
