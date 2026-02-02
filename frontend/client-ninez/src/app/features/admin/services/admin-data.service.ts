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
        return this.http.get<any[]>(`${this.apiUrl}/entidades`);
    }

    createEntity(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/entidades`, data);
    }

    updateEntity(id: number | string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/entidades/${id}`, data);
    }

    deleteEntity(id: number | string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/entidades/${id}`);
    }

    getRoles(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/roles`);
    }

    createRole(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/roles`, data);
    }

    updateRole(id: number | string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/roles/${id}`, data);
    }

    deleteRole(id: number | string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/roles/${id}`);
    }
}
