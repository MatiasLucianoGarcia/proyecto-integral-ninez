import { Injectable, signal } from '@angular/core';
import { User } from '../domain/user';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userData = signal<User | null>(null);

  constructor() { }

  // Obtiene el usuario desde memoria o localStorage
  getUser(): User | null {
    if (!this.userData()) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user: User = JSON.parse(userStr);
        this.userData.set(user);
      }
    }
    return this.userData();
  }

  // Guarda el usuario en memoria y localStorage
  setUser(user: User) {
    this.userData.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Limpia la sesión
  clearUser() {
    this.userData.set(null);
    localStorage.removeItem('user');
  }
}
