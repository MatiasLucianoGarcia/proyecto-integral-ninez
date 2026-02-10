import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Persona } from '../domain';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PersonService {
	private http: HttpClient = inject(HttpClient);

	constructor() { }

	getPersons(): Observable<Persona[]> {
		return this.http.get<Persona[]>(environment.apiUrl + '/personas');
	}

	getPersonByDNI(dni: string): Observable<Persona> {
		return this.http.get<Persona>(`${environment.apiUrl}/personas/${dni}`);
	}

	searchPersons(dni?: string, nombre?: string): Observable<Persona[]> {
		return this.http.post<Persona[]>(environment.apiUrl + '/personas/search', {
			...(dni ? { dni } : {}),
			...(nombre ? { nombre } : {}),
		});
	}

	createPerson(person: Partial<Persona>): Observable<Persona> {
		return this.http.post<Persona>(environment.apiUrl + '/personas', person);
	}

	updatePerson(dni: number, person: Partial<Persona>): Observable<Persona> {
		return this.http.put<Persona>(`${environment.apiUrl}/personas/${dni}`, person);
	}

	getGeneros(): Observable<any[]> {
		return this.http.get<any[]>(environment.apiUrl + '/generos');
	}

	getNacionalidades(): Observable<any[]> {
		return this.http.get<any[]>(environment.apiUrl + '/nacionalidades');
	}
}
