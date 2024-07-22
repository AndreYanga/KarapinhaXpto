import { Component, OnInit } from '@angular/core';
import { SiteCategoriaService } from '../../../Services/site-categoria.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  categorias: any[] = [];
  servicos: any[] = [];

  constructor(private dataService: SiteCategoriaService) {}

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
}
