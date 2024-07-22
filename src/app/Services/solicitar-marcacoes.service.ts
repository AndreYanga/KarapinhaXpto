import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitarMarcacoesService {
  private apiUrl = 'https://localhost:7075/api';

  constructor(private http: HttpClient) { }

  listarServicosPorCategoria(categoriaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Servico/ListarPorIdCategoria/${categoriaId}`);
  }

  listarProfissionaisPorServico(servicoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Profissional/ByServicoId/${servicoId}`);
  }

  listarHorariosPorProfissional(profissionalId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ProfissionalHorario/ListarHorariosPorProfissionalId/${profissionalId}`);
  }

  registrarMarcacao(marcacao: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Marcacao/SalvarERetornarId`, marcacao);
  }

  salvarServicoMarcacao(servicoMarcacao: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ServicoMarcacao/CriarServicoMarcacao`, servicoMarcacao);
  }

  listarIdProfissionalPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Profissional/idPorEmail?email=${email}`);
  }

  listarServicoMarcacaoPorProfissionalId(profissionalId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ServicoMarcacao/ListarPorProfissionalId/${profissionalId}`);
  }
}
