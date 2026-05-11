import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  private apiUrl = 'http://localhost:8080/technologies';

  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // CREATE
  create(tech: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tech);
  }

  // UPDATE
  update(id: number, tech: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tech);
  }

  // DELETE
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
