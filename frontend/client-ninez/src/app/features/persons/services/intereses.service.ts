import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Intereses } from '../domain/intereses.model';

@Injectable({
    providedIn: 'root'
})
export class InteresesService {
    private apiUrl = environment.apiUrl + '/intereses';

    constructor(private http: HttpClient) { }

    getIntereses(dni: number): Observable<Intereses> {
        return this.http.get<Intereses>(`${this.apiUrl}/${dni}`);
    }

    updateIntereses(dni: number, intereses: Partial<Intereses>): Observable<Intereses> {
        return this.http.put<Intereses>(`${this.apiUrl}/${dni}`, intereses);
    }
}
