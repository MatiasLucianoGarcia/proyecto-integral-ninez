import { environment } from '@env/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ControlMedico } from '../domain/control-medico.model';

@Injectable({
    providedIn: 'root'
})
export class ControlMedicoService {
    private http = inject(HttpClient);
    // Using hardcoded URL as per project standard
    private apiUrl = environment.apiUrl + '/controlMedico';

    getControles(dni: number): Observable<ControlMedico[]> {
        return this.http.get<ControlMedico[]>(`${this.apiUrl}/${dni}`);
    }

    createControl(control: Partial<ControlMedico>): Observable<ControlMedico> {
        return this.http.post<ControlMedico>(this.apiUrl, control);
    }

    deleteControl(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
