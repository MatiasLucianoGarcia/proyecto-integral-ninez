import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NacionalityService {

  private http = inject(HttpClient);

  constructor() { }

  getAllNationalities() {
    return this.http.get(environment.apiUrl + '/nacionalidades');
  }
}
