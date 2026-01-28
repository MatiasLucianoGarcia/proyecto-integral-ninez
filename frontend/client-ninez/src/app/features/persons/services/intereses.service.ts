import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Intereses } from '../domain/intereses.model';

@Injectable({
    providedIn: 'root'
})
export class InteresesService {
    private apiUrl = 'http://localhost:8080/api/intereses';

    constructor(private http: HttpClient) { }

    getIntereses(dni: number): Observable<Intereses> {
        return this.http.get<Intereses>(`${this.apiUrl}/${dni}`);
    }

    updateIntereses(dni: number, intereses: Partial<Intereses>): Observable<Intereses> {
        return this.http.put<Intereses>(`${this.apiUrl}/${dni}`, intereses);
    }
}
