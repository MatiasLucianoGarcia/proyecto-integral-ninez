import { environment } from '@env/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajo } from '../domain/trabajo.model';

@Injectable({
    providedIn: 'root'
})
export class TrabajoService {
    private http = inject(HttpClient);
    // Hardcoded API URL
    private apiUrl = environment.apiUrl + '/trabajo';

    getTrabajos(dni: number): Observable<Trabajo[]> {
        return this.http.get<Trabajo[]>(`${this.apiUrl}/${dni}`);
    }

    createTrabajo(trabajo: Partial<Trabajo>): Observable<Trabajo> {
        return this.http.post<Trabajo>(this.apiUrl, trabajo);
    }

    deleteTrabajo(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
