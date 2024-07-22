import { Component, OnInit } from '@angular/core';
import { SiteCategoriaService } from '../../../Services/site-categoria.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router'; // Importando Router para redirecionamento

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  categorias: any[] = [];
  servicos: any[] = [];

  constructor(
    private dataService: SiteCategoriaService,
    private authService: AuthService, // Injetando AuthService
    private router: Router // Injetando Router
  ) {}

  ngOnInit(): void {
    this.carregarCategoriasEServicos();
  }

  carregarCategoriasEServicos(): void {
    this.dataService.getCategoriasEServicos().subscribe(response => {
      const [categoriasData, servicosData] = response;

      if (categoriasData.sucesso) {
        this.categorias = categoriasData.dados.map((categoria: any) => ({
          ...categoria,
          foto: `https://localhost:7075/assets/${categoria.foto}` // Ajuste aqui para o caminho completo
        }));
      } else {
        console.error('Falha ao buscar categorias:', categoriasData.mensagem);
      }

      if (servicosData.sucesso) {
        this.servicos = servicosData.dados;
      } else {
        console.error('Falha ao buscar serviços:', servicosData.mensagem);
      }
    }, error => {
      console.error('Erro ao buscar categorias e serviços:', error);
    });
  }

  getServicosPorCategoriaId(categoriaId: number): any[] {
    return this.servicos.filter(servico => servico.categoriaId === categoriaId);
  }

  agendarServico(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['layout/welcome']); // Redireciona para o painel se logado
    } else {
      this.router.navigate(['/login']); // Redireciona para o login se não logado
    }
  }
}
