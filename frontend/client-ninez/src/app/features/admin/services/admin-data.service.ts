import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminDataService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api';

    constructor() { }

    getEntities(): Observable<any[]> {
        // Requires Admin role, which we have.
        // Endpoint: /entidades
        return this.http.get<any[]>(`${this.apiUrl}/entidades`);
    }

    getRoles(): Observable<any[]> {
        // Endpoint: /roles
        return this.http.get<any[]>(`${this.apiUrl}/roles`);
    }
}
