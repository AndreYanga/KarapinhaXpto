

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GerirMarcacoesService {

  private apiUrl = 'https://localhost:7075/api';

  constructor(private http: HttpClient) { }

  ListarTodasMarcacoes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Marcacao/ListarTodos`);
  }

  confirmarMarcacao(marcacaoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Marcacao/confirmarMarcacoes/${marcacaoId}`, {});
  }

  getUtilizadorPorId(utilizadorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utilizador/ListaUtilizadorPorId${utilizadorId}`);
  }

  enviarEmail(emailData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Email/enviar`, emailData, { responseType: 'text' }).pipe(
      map(response => {
        // Convert the plain text response to a JSON-like structure
        return { sucesso: true, mensagem: response };
      }),
      catchError(error => {
        // Handle error response and convert to a JSON-like structure
        return [{ sucesso: false, mensagem: error.message }];
      })
    );
  }


}
