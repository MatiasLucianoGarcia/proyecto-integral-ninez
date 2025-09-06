import { Injectable, signal } from '@angular/core';
import { User } from '../domain/user';
import { UserSessionsDTO } from '../domain/user-sessions-dto';

@Injectable({
	providedIn: 'root',
})
export class UserDataService {
	private userData = signal<User | null>(null);
	private tokenData = signal<string | null>(null);

	constructor() {}

	// Obtiene el usuario desde memoria o localStorage
	getUser(): User | null {
		if (!this.userData()) {
			const userStr = localStorage.getItem('user');
			const tokenStr = localStorage.getItem('token');
			if (userStr) {
				const user: User = JSON.parse(userStr);
				this.userData.set(user);
			}
			if (tokenStr) {
				this.tokenData.set(tokenStr);
			}
		}
		return this.userData();
	}

	// Guarda el usuario en memoria y localStorage
	setUser(userSessionData: UserSessionsDTO) {
		const { usuario, token } = userSessionData;
		this.userData.set(usuario);
		localStorage.setItem('user', JSON.stringify(usuario));
		localStorage.setItem('token', token);
	}

	// Limpia la sesión
	clearUser() {
		this.userData.set(null);
		localStorage.removeItem('user');
	}
}
