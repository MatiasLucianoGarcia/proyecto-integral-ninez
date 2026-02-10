import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private http = inject(HttpClient);

  constructor() { }

  getAllGenders() {
    return this.http.get(environment.apiUrl + '/generos');
  }

}
