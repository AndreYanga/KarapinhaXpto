// src/app/services/marcacao.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcacaoService {

  private apiUrl = 'https://localhost:7075/api';

  constructor(private http: HttpClient) { }

  listarMarcacoesPorUtilizadorId(utilizadorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Marcacao/ListarMarcacoesPorUtilizadorId/${utilizadorId}`);
  }

  listarServicosPorMarcacaoId(marcacaoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ServicoMarcacao/ListarServicoMarcacaPorMarcacaoId/${marcacaoId}`);
  }

  reagendarMarcacao(idServico: number, novaDataHora: string): Observable<any> {
    const body = { id: idServico, novaDataHora };
    return this.http.post(`${this.apiUrl}/ServicoMarcacao/reagendar`, body);
  }

  cancelarMarcacao(idServico: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ServicoMarcacao/cancelar/${idServico}`);
  }
}
