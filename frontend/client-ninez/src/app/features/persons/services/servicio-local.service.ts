import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioLocal, CreateServicioLocal, EquipoLocal, DerechoVulnerado } from '../domain/servicio-local.model';

@Injectable({
    providedIn: 'root'
})
export class ServicioLocalService {
    private http = inject(HttpClient);

    // Base URLs
    private apiUrl = 'http://localhost:8080/api/servicioLocal';
    private equipoUrl = 'http://localhost:8080/api/equipoLocal';
    private derechoUrl = 'http://localhost:8080/api/derechoVulnerado';

    getServiciosLocalesByDni(dni: number): Observable<ServicioLocal[]> {
        return this.http.get<ServicioLocal[]>(`${this.apiUrl}/dni/${dni}`);
    }

    createServicioLocal(data: CreateServicioLocal): Observable<ServicioLocal> {
        return this.http.post<ServicioLocal>(this.apiUrl, data);
    }

    deleteServicioLocal(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Helper methodologies for dropdowns
    getEquiposLocales(): Observable<EquipoLocal[]> {
        return this.http.get<EquipoLocal[]>(this.equipoUrl);
    }

    getDerechosVulnerados(): Observable<DerechoVulnerado[]> {
        return this.http.get<DerechoVulnerado[]>(this.derechoUrl);
    }
}
