import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Efector } from '../domain/efector.model';

@Injectable({
    providedIn: 'root'
})
export class EfectorService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/efectores';

    getEfectores(): Observable<Efector[]> {
        return this.http.get<Efector[]>(this.apiUrl);
    }
}
