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
}
