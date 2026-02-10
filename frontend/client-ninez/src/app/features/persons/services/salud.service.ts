import { environment } from '@env/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salud } from '../domain/salud.model';

@Injectable({
    providedIn: 'root'
})
export class SaludService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/salud';

    getSalud(dni: number): Observable<Salud> {
        return this.http.get<Salud>(`${this.apiUrl}/${dni}`);
    }

    updateSalud(dni: number, salud: Partial<Salud>): Observable<Salud> {
        return this.http.put<Salud>(`${this.apiUrl}/${dni}`, salud);
    }
}
