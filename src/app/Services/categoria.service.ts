import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  adicionarCategoria(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('Nome', data.nome);
    formData.append('Descricao', data.descricao);
    if (data.foto) {
      const fileName = `${data.nome}.png`;
      formData.append('Foto', data.foto as Blob, fileName);
    }

    return this.http.post<any>(`${this.apiUrl}/Categoria/SalvarCategorias`, formData);
  }

  listarCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Categoria/ListaCategorias`);
  }

  deletarCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Categoria/DeletarCategorias${id}`);
  }
}
