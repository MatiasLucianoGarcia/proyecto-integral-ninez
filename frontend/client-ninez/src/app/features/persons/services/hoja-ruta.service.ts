import { environment } from '@env/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HojaRuta, CreateHojaRuta } from '../domain/hoja-ruta.model';

@Injectable({
    providedIn: 'root'
})
export class HojaRutaService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/hojaRuta';

    getHojasRutaByDni(dni: number): Observable<HojaRuta[]> {
        return this.http.get<HojaRuta[]>(`${this.apiUrl}/dni/${dni}`);
    }

    getHojasRutaByServicioId(servicioId: number): Observable<HojaRuta[]> {
        return this.http.get<HojaRuta[]>(`${this.apiUrl}/servicio/${servicioId}`);
    }

    createHojaRuta(data: CreateHojaRuta): Observable<HojaRuta> {
        return this.http.post<HojaRuta>(this.apiUrl, data);
    }

    deleteHojaRuta(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
