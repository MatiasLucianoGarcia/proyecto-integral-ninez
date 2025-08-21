import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private http = inject(HttpClient);

  constructor() { }

  getAllGenders() {
    return this.http.get('http://localhost:8080/api/generos');
  }

}
