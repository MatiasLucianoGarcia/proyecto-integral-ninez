import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { UserSessionsDTO } from '../../../core/models/user-sessions-dto';
import { User } from '../../../core/models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);

  // private readonly mockEmail = 'mati@mail.com';
  // private readonly mockPassword = '123456';
  private user  = signal<UserSessionsDTO | null>(null)

  login(nombre: string, contraseña: string): Observable<UserSessionsDTO> {
      return this.http.post<UserSessionsDTO>('http://localhost:8080/api/auth/login', { nombre, contraseña }).pipe(
        tap(res=> {
          this.user.set(res);
          localStorage.setItem('user', JSON.stringify(res));
        })
     );
  }

  getUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
    return this.user;
  }

}
