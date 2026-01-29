import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Efector } from '../domain/efector.model';

@Injectable({
    providedIn: 'root'
})
export class EfectorService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/efectores';

    getEfectores(): Observable<Efector[]> {
        return this.http.get<Efector[]>(this.apiUrl);
    }
}
