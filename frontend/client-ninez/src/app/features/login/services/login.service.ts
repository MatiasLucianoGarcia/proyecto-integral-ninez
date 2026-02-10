import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { UserSessionsDTO } from '../domain/user-sessions-dto';
import { User } from '../domain/user';
import { UserDataService } from '../data/user-data.service';

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	private http = inject(HttpClient);
	private userDataService = inject(UserDataService);

	login(nombre: string, contraseña: string): Observable<UserSessionsDTO> {
		return this.http.post<UserSessionsDTO>(environment.apiUrl + '/auth/login', { nombre, contraseña }).pipe(
			tap((res) => {
				this.userDataService.setUser(res);
			}),
		);
	}

	getUser(): User | null {
		return this.userDataService.getUser();
	}
}
