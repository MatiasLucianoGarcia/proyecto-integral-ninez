import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateVivienda, TipoVivienda, Vivienda } from '../domain/vivienda.model';

@Injectable({
    providedIn: 'root'
})
export class ViviendaService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/vivienda';
    private tipoUrl = environment.apiUrl + '/tipoVivienda';

    getViviendasByDni(dni: number): Observable<Vivienda[]> {
        return this.http.get<Vivienda[]>(`${this.apiUrl}/${dni}`);
    }

    createVivienda(vivienda: CreateVivienda): Observable<Vivienda> {
        return this.http.post<Vivienda>(this.apiUrl, vivienda);
    }

    deleteVivienda(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getTiposVivienda(): Observable<TipoVivienda[]> {
        return this.http.get<TipoVivienda[]>(this.tipoUrl);
    }
}
