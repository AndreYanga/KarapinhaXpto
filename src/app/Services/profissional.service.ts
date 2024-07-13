// profissional.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Horario {
  id: number;
  descricao: string;
}

interface Servico {
  id: number;
  descricao: string;
}

interface HorarioResponse {
  dados: Horario[];
  mensagem: string;
  sucesso: boolean;
}

interface ServicoResponse {
  dados: Servico[];
  mensagem: string;
  sucesso: boolean;
}

interface ProfissionalCadastro {
  Nome: string;
  Email: string;
  BI: string;
  Telefone: string;
  ServicoId: number;
  Foto: File | null; // Adiciona a propriedade Foto como um File ou null
}

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private apiUrl = 'https://localhost:7075/api';

  constructor(private http: HttpClient) {}

  cadastrarProfissional(profissional: ProfissionalCadastro): Observable<any> {
    const formData = new FormData();

    formData.append('Nome', profissional.Nome);
    formData.append('Email', profissional.Email);
    formData.append('BI', profissional.BI);
    formData.append('Telefone', profissional.Telefone);
    formData.append('ServicoId', profissional.ServicoId.toString());

    // Adiciona a foto se estiver presente
    if (profissional.Foto) {
      const fileName = `${profissional.Nome}.png`; // Usa o nome de usuário como o nome do arquivo com extensão PNG
      formData.append('Foto', profissional.Foto as Blob, fileName); // Salva a foto com o nome de usuário
    }

    const url = `${this.apiUrl}/Profissional/SalvarProfissionais`;
    return this.http.post<any>(url, formData);
  }

  obterIdProfissionalPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Profissional/idPorEmail?email=${email}`);
  }

  obterHorariosTrabalho(): Observable<HorarioResponse> {
    return this.http.get<HorarioResponse>(`${this.apiUrl}/Horario/ListaHorarios`);
  }

  obterServicos(): Observable<ServicoResponse> {
    return this.http.get<ServicoResponse>(`${this.apiUrl}/Servico/ListaServicos`);
  }

  cadastrarHorarioProfissional(dados: any): Observable<any> {
    const url = `${this.apiUrl}/ProfissionalHorario/SalvarProfissionaisHorario`;
    return this.http.post<any>(url, dados);
  }

  listarProfissionais(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Profissional/ListaProfissionais`);
  }
}
