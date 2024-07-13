import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicoService } from '../../../Services/servico.service';
import { CategoriaService } from '../../../Services/categoria.service'; // Importe o serviço de categorias
import { Servico, ServicoResponse } from '../../../Interfaces/servico.interface'; // Corrija o caminho conforme necessário

@Component({
  selector: 'app-gerir-servicos',
  templateUrl: './gerir-servicos.component.html',
  styleUrls: ['./gerir-servicos.component.css']
})
export class GerirServicosComponent implements OnInit {
  servicos: Servico[] = [];
  categorias: any[] = [];
  novaServico: Servico = {
    id: 0,
    descricao: '',
    categoriaId: null,
    preco: null
  };
  errorMessage: string | null = '';

  constructor(
    private servicoService: ServicoService,
    private categoriaService: CategoriaService, // Injete o serviço de categorias
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarServicos();
    this.carregarCategorias(); // Carrega a lista de categorias ao inicializar o componente
  }

  carregarServicos(): void {
    this.servicoService.listarServicos().subscribe(response => {
      this.servicos = response.dados;
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(response => {
      this.categorias = response.dados;
    });
  }

  adicionarServico(): void {
    this.servicoService.salvarServico(this.novaServico).subscribe({
      next: (response: ServicoResponse) => {
        if (response.sucesso) {
          this.carregarServicos();
          this.resetNovaServico();
          alert('Serviço adicionado com sucesso!');
        } else {
          this.handleErrorResponse(response);
        }
      },
      error: (error: any) => {
        console.error('Erro ao adicionar serviço:', error);
        alert('Erro ao adicionar serviço. Por favor, tente novamente.');
      }
    });
  }

  resetNovaServico(): void {
    this.novaServico = {
      id: 0,
      descricao: '',
      categoriaId: null,
      preco: null
    };
  }

  nomeCategoria(categoriaId: number | null): string {
    if (!categoriaId) return ''; // Trata o caso de categoriaId ser nulo
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nome : '';
  }

  private handleErrorResponse(response: ServicoResponse): void {
    if (response.mensagem === 'Erro ao adicionar serviço. Categoria não encontrada.') {
      this.errorMessage = 'Categoria não encontrada. Verifique se a categoria selecionada é válida.';
      alert('Categoria não encontrada. Verifique se a categoria selecionada é válida.');
    } else {
      this.errorMessage = 'Erro ao adicionar serviço. Por favor, tente novamente.';
      alert('Erro ao adicionar serviço. Por favor, tente novamente.');
    }
  }
}
