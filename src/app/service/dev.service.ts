import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DevService {

  private api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  buscarDev(id: number) {
    return this.http.get<any>(`${this.api}/dev/${id}`);
  }

  atualizarDev(id: number, dev: any) {
    return this.http.put<any>(`${this.api}/dev/${id}`, dev, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}
