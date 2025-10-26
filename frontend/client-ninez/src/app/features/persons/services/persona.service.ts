import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../domain/persona.model';

@Injectable({ providedIn: 'root' })
export class PersonaService {
	private apiUrl = '/api/personas'; // Ajusta la URL según tu backend

	constructor(private http: HttpClient) {}

	getPersonaPorDni(dni: number): Observable<Persona | null> {
		return this.http.get<Persona | null>(`${this.apiUrl}/dni/${dni}`);
	}

	crearPersona(persona: Persona): Observable<Persona> {
		return this.http.post<Persona>(this.apiUrl, persona);
	}

	actualizarPersona(persona: Persona): Observable<Persona> {
		return this.http.put<Persona>(`${this.apiUrl}/${persona.dni}`, persona);
	}
}
