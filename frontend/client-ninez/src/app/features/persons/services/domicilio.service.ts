import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateDomicilio, Domicilio } from '../domain/domicilio.model';

@Injectable({
    providedIn: 'root',
})
export class DomicilioService {
    private http: HttpClient = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/domicilios';

    constructor() { }

    getDomicilios(dni: number): Observable<Domicilio[]> {
        return this.http.get<Domicilio[]>(`${this.apiUrl}/${dni}`);
    }

    crearDomicilio(domicilio: CreateDomicilio): Observable<Domicilio> {
        return this.http.post<Domicilio>(this.apiUrl, domicilio);
    }

    eliminarDomicilio(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
