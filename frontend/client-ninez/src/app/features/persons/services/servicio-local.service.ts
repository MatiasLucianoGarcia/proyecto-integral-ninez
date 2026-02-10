import { environment } from '@env/environment';
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
    private apiUrl = environment.apiUrl + '/servicioLocal';
    private equipoUrl = environment.apiUrl + '/equipoLocal';
    private derechoUrl = environment.apiUrl + '/derechoVulnerado';

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
