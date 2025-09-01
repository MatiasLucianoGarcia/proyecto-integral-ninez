import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private http = inject(HttpClient);

  getAllPersons(): Observable<any> {
    return this.http.get('http://localhost:8080/api/personas');
  }

  savePerson(personData: {dni:number, nombre:string, apellido:string, fechaNacimiento:Date, id_genero:number, id_nacionalidad:number, token:string }): Observable<any> {
    const { token, ...req } = personData;
    return this.http.post('http://localhost:8080/api/personas', req);
  }
}
