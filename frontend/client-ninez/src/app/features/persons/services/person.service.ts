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
		return this.http.get<Persona[]>('http://localhost:8080/api/personas');
	}

	getPersonByDNI(dni: string): Observable<Persona> {
		return this.http.get<Persona>(`http://localhost:8080/api/personas/${dni}`);
	}

	searchPersons(dni?: string, nombre?: string): Observable<Persona[]> {
		return this.http.post<Persona[]>('http://localhost:8080/api/personas/search', {
			...(dni ? { dni } : {}),
			...(nombre ? { nombre } : {}),
		});
	}

	createPerson(person: Partial<Persona>): Observable<Persona> {
		return this.http.post<Persona>('http://localhost:8080/api/personas', person);
	}

	updatePerson(dni: number, person: Partial<Persona>): Observable<Persona> {
		return this.http.put<Persona>(`http://localhost:8080/api/personas/${dni}`, person);
	}

	getGeneros(): Observable<any[]> {
		return this.http.get<any[]>('http://localhost:8080/api/generos');
	}

	getNacionalidades(): Observable<any[]> {
		return this.http.get<any[]>('http://localhost:8080/api/nacionalidades');
	}
}
