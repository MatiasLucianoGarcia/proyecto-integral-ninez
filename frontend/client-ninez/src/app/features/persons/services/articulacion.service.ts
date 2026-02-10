import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Articulacion, CreateArticulacion } from '../domain/articulacion.model';

@Injectable({
    providedIn: 'root'
})
export class ArticulacionService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/articulacion';

    getArticulacionesByDni(dni: number): Observable<Articulacion[]> {
        return this.http.get<Articulacion[]>(`${this.apiUrl}/dni/${dni}`);
    }

    createArticulacion(articulacion: CreateArticulacion): Observable<Articulacion> {
        return this.http.post<Articulacion>(this.apiUrl, articulacion);
    }

    deleteArticulacion(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
