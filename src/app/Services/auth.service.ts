import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Dados } from '../Interfaces/auth.interface';
import { RegisterRequest, RegisterResponse } from '../Interfaces/register.interface';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject: BehaviorSubject<Dados | null>;
  public currentUser$: Observable<Dados | null>; // Adicionando esta linha

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Dados | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable(); // Inicializando o Observable
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUserValue(): Dados | null {
    return this.currentUserSubject.value;
  }

  updateStatus(userId: number, status: boolean): Observable<any> {
    const formData = new FormData();
    formData.append('Id', userId.toString());
    formData.append('Ativo', status.toString());

    //return this.http.put<any>(`${this.apiUrl}/AtualizarUtilizador/${userId}`, formData);
    return this.http.put<any>(`${this.apiUrl}/Utilizador/AtualizarUtilizador/${userId}`, formData);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, data)
      .pipe(
        tap(response => {
          if (response.sucesso) {
            this.currentUserSubject.next(response.dados);
            localStorage.setItem('currentUser', JSON.stringify(response.dados));
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    const formData = new FormData();

    formData.append('NomeCompleto', data.nomeCompleto);
    formData.append('Email', data.email);
    formData.append('Telemovel', data.telemovel);
    formData.append('BI', data.bi);
    formData.append('UserName', data.userName);
    formData.append('Password', data.password);
    formData.append('PerfilId', data.perfilId.toString());
    formData.append('Ativo', data.ativo.toString());
    formData.append('Status', data.status.toString());
    if (data.foto) {
      const fileName = `${data.userName}.png`; // Usa o nome de usuário como o nome do arquivo com extensão PNG
      formData.append('Foto', data.foto as Blob, fileName); // Salva a foto com o nome de usuário
    }

    return this.http.post<RegisterResponse>(`${this.apiUrl}/Utilizador/SalvarUtilizador`, formData);
  }

  updateProfile(userData: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Id', userData.id ? userData.id.toString() : '');
    formData.append('NomeCompleto', userData.nomeCompleto || '');
    formData.append('UserName', userData.userName || '');
    formData.append('Telemovel', userData.telemovel || '');
    formData.append('Email', userData.email || '');
    formData.append('Password', userData.password || ''); // Adiciona a senha no formulário
    formData.append('Status', userData.status.toString()); // Adiciona o status

    if (userData.foto) {
      const fileName = `${userData.userName}.png`; // Usa o nome de usuário como o nome do arquivo com extensão PNG
      formData.append('Foto', userData.foto as Blob, fileName); // Salva a foto com o nome de usuário
    }

    return this.http.put<any>(`${this.apiUrl}/Utilizador/AtualizarUtilizador/${userData.id}`, formData);
  }




  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<{ dados: { id: number } }>(`${this.apiUrl}/Utilizador/ByEmail?email=${email}`)
      .pipe(
        map(response => response.dados.id)
      );
  }

  listAdministrativos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Utilizador/ListarUtilizadores`);
  }

  updateStatus1(userId: number, status: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Utilizador/${userId}/ativo`, { ativo: status });
  }

  listUsuariosPendentes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Utilizador/ListarUtilizadores`);
  }

  ativarConta(usuarioId: number, novoStatus: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Utilizador/${usuarioId}/ativo`, { ativo: novoStatus });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  gerarNomeUsuario(nome: string): string {
    return `${nome.toLowerCase().replace(/\s/g, '')}_${Math.floor(Math.random() * 1000)}`;
  }

  gerarSenha(): string {
    return Math.random().toString(36).slice(-8);
  }

  enviarEmail_1(emailData: any): Observable<any> {

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

  enviarEmail_2(emailData: any): Observable<any> {
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


  buscarPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Utilizador/ByEmail?email=${email}`);
  }

  removerProfissional(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/Profissional/DeletarProfissionais?id=${id}`);
  }


  verificarPerfil(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Profissional/idPorEmail?email=${email}`);
  }

  atualizarProfissional(id: number, dados: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Id', id.toString());
    formData.append('Nome', dados.nomeCompleto || '');
    formData.append('Email', dados.email || '');
    formData.append('Telefone', dados.telemovel || '');

    if (dados.foto) {
      const fileName = `${dados.userName}.png`; // Usa o nome de usuário como o nome do arquivo com extensão PNG
      formData.append('Foto', dados.foto as Blob, fileName); // Salva a foto com o nome de usuário
    }

    return this.http.put<any>(`${this.apiUrl}/Profissional/AtualizarProfissionais`, formData);
  }


}
