import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/usuarios';

    updatePassword(password: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/perfil/clave`, { contraseña: password });
    }
}
