import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FamilyMember, CreateFamilyMember, Parentezco } from '../domain/familia.model';

@Injectable({
	providedIn: 'root',
})
export class FamilyService {
	private http = inject(HttpClient);
	private apiUrl = environment.apiUrl;

	getFamilyByDNI(dni: number): Observable<FamilyMember[]> {
		return this.http.get<FamilyMember[]>(`${this.apiUrl}/familia/${dni}`);
	}

	createFamilyRelation(familyData: CreateFamilyMember): Observable<any> {
		return this.http.post(`${this.apiUrl}/familia`, familyData);
	}

	updateFamilyRelation(id: number, familyData: Partial<CreateFamilyMember>): Observable<any> {
		return this.http.put(`${this.apiUrl}/familia/${id}`, familyData);
	}

	deleteFamilyRelation(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/familia/${id}`);
	}

	getParentezcoTypes(): Observable<Parentezco[]> {
		return this.http.get<Parentezco[]>(`${this.apiUrl}/parentezcos`);
	}

	suggestFamily(dni: number): Observable<any[]> {
		return this.http.get<any[]>(`${this.apiUrl}/familia/sugerir/${dni}`);
	}
}
