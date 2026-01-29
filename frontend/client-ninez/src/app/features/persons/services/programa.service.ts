import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Programa } from '../domain/programa.model';

@Injectable({
    providedIn: 'root'
})
export class ProgramaService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/programas';

    getProgramas(): Observable<Programa[]> {
        return this.http.get<Programa[]>(this.apiUrl);
    }
}
