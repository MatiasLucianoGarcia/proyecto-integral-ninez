import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FamilyMember, CreateFamilyMember, Parentezco } from '../domain/familia.model';

@Injectable({
	providedIn: 'root',
})
export class FamilyService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:8080/api';

	getFamilyByDNI(dni: number): Observable<FamilyMember[]> {
		return this.http.get<FamilyMember[]>(`${this.apiUrl}/familias/${dni}`);
	}

	createFamilyRelation(familyData: CreateFamilyMember): Observable<any> {
		return this.http.post(`${this.apiUrl}/familias`, familyData);
	}

	updateFamilyRelation(id: number, familyData: Partial<CreateFamilyMember>): Observable<any> {
		return this.http.put(`${this.apiUrl}/familias/${id}`, familyData);
	}

	deleteFamilyRelation(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/familias/${id}`);
	}

	getParentezcoTypes(): Observable<Parentezco[]> {
		return this.http.get<Parentezco[]>(`${this.apiUrl}/parentezcos`);
	}

	suggestFamily(dni: number): Observable<any[]> {
		return this.http.get<any[]>(`${this.apiUrl}/familias/sugerir/${dni}`);
	}
}
