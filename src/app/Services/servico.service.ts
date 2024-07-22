import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../Interfaces/servico.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private baseUrl = 'https://localhost:7075/api';

  constructor(private http: HttpClient) { }

  salvarServico(servico: Servico): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Servico/SalvarServicos`, servico);
  }

  listarServicos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Servico/ListaServicos`);
  }

  listarCategorias(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Categoria/ListaCategorias`);
  }

  removerServico(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Servico/DeletarServicos${id}`);
  }
}
