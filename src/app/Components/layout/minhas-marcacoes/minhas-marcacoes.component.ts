import { Component, OnInit } from '@angular/core';
import { MarcacaoService } from '../../../Services/marcacao.service';
import { AuthService } from '../../../Services/auth.service';
import $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-minhas-marcacoes',
  templateUrl: './minhas-marcacoes.component.html',
  styleUrls: ['./minhas-marcacoes.component.css']
})
export class MinhasMarcacoesComponent implements OnInit {

  marcacoes: any[] = [];
  servicosPorMarcacao: { [key: number]: any[] } = {};
  utilizadorId: number = 0; // Inicializa com 0 ou outro valor padrão
  marcacaoSelecionada: any; // Variável para armazenar a marcação selecionada para reagendamento

  constructor(
    private marcacaoService: MarcacaoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.obterUtilizadorAtual();
    if (this.utilizadorId) {
      this.listarMarcacoes(this.utilizadorId);
    }
  }

  obterUtilizadorAtual(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.utilizadorId = currentUser.id;
    }
  }

  listarMarcacoes(utilizadorId: number): void {
    this.marcacaoService.listarMarcacoesPorUtilizadorId(utilizadorId).subscribe(response => {
      this.marcacoes = response.dados;
      this.marcacoes.forEach(marcacao => {
        this.listarServicosPorMarcacao(marcacao.id);
      });
    });
  }

  listarServicosPorMarcacao(marcacaoId: number): void {
    this.marcacaoService.listarServicosPorMarcacaoId(marcacaoId).subscribe(response => {
      this.servicosPorMarcacao[marcacaoId] = response.dados;
    });
  }

  openModal(marcacao: any): void {
    this.marcacaoSelecionada = marcacao;
    $('#reagendarModal').modal('show');
  }

}
