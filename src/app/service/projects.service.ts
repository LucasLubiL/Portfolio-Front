import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  private api = 'http://localhost:8080/projects';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  criar(formData: FormData): Observable<any> {
    return this.http.post<any>(this.api, formData);
  }

  atualizarProjeto(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, formData);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
