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

    // Géneros
    getGeneros(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/generos`);
    }

    createGenero(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/generos`, data);
    }

    updateGenero(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/generos/${id}`, data);
    }

    deleteGenero(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/generos/${id}`);
    }

    // Nacionalidades
    getNacionalidades(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/nacionalidades`);
    }

    createNacionalidad(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/nacionalidades`, data);
    }

    updateNacionalidad(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/nacionalidades/${id}`, data);
    }

    deleteNacionalidad(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/nacionalidades/${id}`);
    }

    // Parentezcos
    getParentezcos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/parentezcos`);
    }

    createParentezco(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/parentezcos`, data);
    }

    updateParentezco(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/parentezcos/${id}`, data);
    }

    deleteParentezco(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/parentezcos/${id}`);
    }

    // Tipos Vivienda
    getTiposVivienda(): Observable<any[]> {
        // Note: Route is singular in index.js: /api/tipoVivienda
        return this.http.get<any[]>(`${this.apiUrl}/tipoVivienda`);
    }

    createTipoVivienda(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/tipoVivienda`, data);
    }

    updateTipoVivienda(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/tipoVivienda/${id}`, data);
    }

    deleteTipoVivienda(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/tipoVivienda/${id}`);
    }

    // Efectores
    getEfectores(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/efectores`);
    }

    createEfector(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/efectores`, data);
    }

    updateEfector(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/efectores/${id}`, data);
    }

    deleteEfector(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/efectores/${id}`);
    }

    // Derechos Vulnerados
    getDerechosVulnerados(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/derechoVulnerado`);
    }

    createDerechoVulnerado(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/derechoVulnerado`, data);
    }

    updateDerechoVulnerado(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/derechoVulnerado/${id}`, data);
    }

    deleteDerechoVulnerado(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/derechoVulnerado/${id}`);
    }

    // Programas
    getProgramas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/programas`);
    }

    createPrograma(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/programas`, data);
    }

    updatePrograma(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/programas/${id}`, data);
    }

    deletePrograma(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/programas/${id}`);
    }

    // Equipo Local
    getEquiposLocales(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/equipoLocal`);
    }

    createEquipoLocal(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/equipoLocal`, data);
    }

    updateEquipoLocal(id: string | number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/equipoLocal/${id}`, data);
    }

    deleteEquipoLocal(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/equipoLocal/${id}`);
    }
}
