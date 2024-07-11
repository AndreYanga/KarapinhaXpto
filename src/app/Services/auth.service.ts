import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Dados } from '../Interfaces/auth.interface';
import { RegisterRequest, RegisterResponse } from '../Interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject: BehaviorSubject<Dados | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Dados | null>(null);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUserValue(): Dados | null {
    return this.currentUserSubject.value;
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

  updateStatus(userId: number, status: boolean): Observable<any> {
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
}
