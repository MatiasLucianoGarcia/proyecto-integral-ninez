import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../domain/contact.model';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = environment.apiUrl + '/contactos';

    constructor(private http: HttpClient) { }

    getContacts(dni: number): Observable<Contact[]> {
        return this.http.get<Contact[]>(`${this.apiUrl}/${dni}`);
    }

    addContact(contact: { dni: number; telefono: string }): Observable<Contact> {
        return this.http.post<Contact>(this.apiUrl, contact);
    }

    deleteContact(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
