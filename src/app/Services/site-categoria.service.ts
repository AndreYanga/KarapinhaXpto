
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteCategoriaService {
  private apiCategoriasUrl = 'https://localhost:7075/api/Categoria/ListaCategorias';
  private apiServicosUrl = 'https://localhost:7075/api/Servico/ListaServicos';
  private professionalUrl = 'https://localhost:7075/api/Profissional/ListaProfissionais';
  private listarServicePorId = 'https://localhost:7075/api/Servico/ListaServicoPorId';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<any> {
    return this.http.get<any>(this.apiCategoriasUrl);
  }

  getServicos(): Observable<any> {
    return this.http.get<any>(this.apiServicosUrl);
  }

  getCategoriasEServicos(): Observable<any[]> {
    return forkJoin([this.getCategorias(), this.getServicos()]);
  }

  getProfessionals(): Observable<any> {
    return this.http.get<any>(this.professionalUrl);
  }

  getServicoById(servicoId: number): Observable<any> {
    return this.http.get<any>(`${this.listarServicePorId}${servicoId}`);
  }
}
