import jsPDF from 'jspdf';
import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../Services/categoria.service';
import { SolicitarMarcacoesService } from '../../../Services/solicitar-marcacoes.service';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-solicitar-marcacao',
  templateUrl: './solicitar-marcacao.component.html',
  styleUrls: ['./solicitar-marcacao.component.css']
})
export class SolicitarMarcacaoComponent implements OnInit {

  servicoSelecionado: any;
  categorias: any[] = [];
  servicos: any[] = [];
  profissionais: any[] = [];
  horarios: any[] = [];
  servicosSelecionados: any[] = [];
  novaMarcacao: any = {
    dataRegistro: new Date().toISOString(),
    totalPagar: 0,
    status: true,
    utilizadorId: 0
  };

  novoServicoMarcacao: any = {
    servicoId: null,
    marcacaoId: null,
    categoriaId: null,
    profissionalId: null,
    data: null,
    hora: null
  };

  constructor(
    private categoriaService: CategoriaService,
    private solicitacaoService: SolicitarMarcacoesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
    this.obterUtilizadorAtual();
  }

  carregarCategorias() {
    this.categoriaService.listarCategorias().subscribe(
      (data) => {
        this.categorias = data.dados;
      },
      (error) => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  obterUtilizadorAtual() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.novaMarcacao.utilizadorId = currentUser.id;
    }
  }

  selecionarCategoria(event: any): void {
    const categoriaId = event.target.value;
    this.novoServicoMarcacao.categoriaId = categoriaId;
    this.solicitacaoService.listarServicosPorCategoria(categoriaId).subscribe(
      response => {
        this.servicos = response.dados;
      },
      error => {
        console.error('Erro ao carregar serviços: ', error);
      }
    );
  }

  selecionarServico(event: any): void {
    const servicoId = event.target.value;
    this.novoServicoMarcacao.servicoId = servicoId;
    this.servicoSelecionado = this.servicos.find(servico => servico.id == servicoId);
    this.solicitacaoService.listarProfissionaisPorServico(servicoId).subscribe(
      response => {
        this.profissionais = response;
      },
      error => {
        console.error('Erro ao carregar profissionais: ', error);
      }
    );
  }

  selecionarProfissional(event: any): void {
    const profissionalId = event.target.value;
    this.novoServicoMarcacao.profissionalId = profissionalId;
    this.solicitacaoService.listarHorariosPorProfissional(profissionalId).subscribe(
      response => {
        this.horarios = response.dados;
      },
      error => {
        console.error('Erro ao carregar horários: ', error);
      }
    );
  }

  selecionarData(event: any): void {
    this.novoServicoMarcacao.data = event.target.value;
  }

  selecionarHora(event: any): void {
    const horarioId = event.target.value;
    console.log('Horário selecionado ID:', horarioId);

    const horarioSelecionado = this.horarios.find(horario => horario.horarioId == horarioId);
    if (horarioSelecionado) {
      const [hour, minute] = horarioSelecionado.horarioDescricao.split(':');
      this.novoServicoMarcacao.hora = {
        hour: parseInt(hour, 10),
        minute: parseInt(minute, 10)
      };
      console.log('Horário selecionado:', this.novoServicoMarcacao.hora);
    } else {
      console.log('Nenhum horário encontrado para o ID:', horarioId);
    }
  }

  adicionarServico(): void {
    console.log('Adicionar serviço chamado');
    console.log('Dados do novo serviço de marcação:', this.novoServicoMarcacao);

    if (this.novoServicoMarcacao.servicoId && this.novoServicoMarcacao.profissionalId && this.novoServicoMarcacao.data && this.novoServicoMarcacao.hora) {
      // Convertendo this.novoServicoMarcacao.data para Date, se necessário
      if (!(this.novoServicoMarcacao.data instanceof Date)) {
        this.novoServicoMarcacao.data = new Date(this.novoServicoMarcacao.data);
      }

      const servicoSelecionado = this.servicos.find(servico => servico.id == this.novoServicoMarcacao.servicoId);
      if (servicoSelecionado) {
        // Construir a data e hora no formato ISO 8601
        const year = this.novoServicoMarcacao.data.getFullYear();
        const month = ('0' + (this.novoServicoMarcacao.data.getMonth() + 1)).slice(-2);
        const day = ('0' + this.novoServicoMarcacao.data.getDate()).slice(-2);
        const hour = ('0' + this.novoServicoMarcacao.hora.hour).slice(-2);
        const minute = ('0' + this.novoServicoMarcacao.hora.minute).slice(-2);
        const dataHora = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

        const novoServico = {
          servicoId: Number(this.novoServicoMarcacao.servicoId),
          categoriaId: Number(this.novoServicoMarcacao.categoriaId),
          profissionalId: Number(this.novoServicoMarcacao.profissionalId),
          dataHora: dataHora,
          descricao: servicoSelecionado.descricao,
          preco: servicoSelecionado.preco,
          servicoNome: servicoSelecionado.descricao, // Nome do serviço
          profissionalNome: this.profissionais.find(profissional => profissional.id == this.novoServicoMarcacao.profissionalId)?.nome // Nome do profissional
        };

        // Adicionar o novo serviço à lista local
        this.servicosSelecionados.push(novoServico);

        // Atualizar o total a pagar
        this.novaMarcacao.totalPagar += servicoSelecionado.preco;

        console.log('Serviço adicionado à lista:', novoServico);
      } else {
        alert('Por favor, selecione todos os detalhes do serviço.');
        console.log('Dados incompletos:', this.novoServicoMarcacao);
      }
    }
  }

  removerServico(servico: any): void {
    const index = this.servicosSelecionados.indexOf(servico);
    if (index !== -1) {
      this.servicosSelecionados.splice(index, 1);
      this.novaMarcacao.totalPagar -= servico.preco;
    }
  }

  confirmarMarcacao(): void {
    this.solicitacaoService.registrarMarcacao(this.novaMarcacao).subscribe(
      response => {
        const marcacaoId = response.id; // Obter o ID da marcação salva
        // Registrar cada serviço da marcação
        this.servicosSelecionados.forEach(servico => {
          const servicoMarcacao = {
            servicoId: servico.servicoId,
            marcacaoId: marcacaoId,
            categoriaId: servico.categoriaId,
            profissionalId: servico.profissionalId,
            dataHora: servico.dataHora
          };

          console.log('Dados do serviço de marcação antes de enviar:', servicoMarcacao);

          this.solicitacaoService.salvarServicoMarcacao(servicoMarcacao).subscribe(
            res => {
              console.log('Serviço de marcação salvo com sucesso', res);
            },
            err => {
              console.error('Erro ao salvar serviço de marcação: ', err);
              alert('Erro ao salvar serviço de marcação');
            }
          );
        });

        // Gerar o PDF após salvar todos os serviços
        this.gerarPDF(marcacaoId);

        // Limpar a lista de serviços selecionados após salvar
        this.servicosSelecionados = [];

        // Limpar também outros dados se necessário, como total a pagar
        this.novaMarcacao.totalPagar = 0;
        // Limpar novoServicoMarcacao para um novo serviço
        this.novoServicoMarcacao = {
          servicoId: null,
          marcacaoId: null,
          categoriaId: null,
          profissionalId: null,
          data: null,
          hora: null
        };

        // Feedback adicional ou redirecionamento após confirmação
        alert('Marcação confirmada com sucesso!');
      },
      error => {
        console.error('Erro ao registrar marcação: ', error);
        alert('Erro ao registrar marcação');
      }
    );
  }

  // Método para gerar e exibir o PDF
  gerarPDF(marcacaoId: number): void {
    // Nome da empresa e localização
    const nomeEmpresa = 'Belleza Karapinha';
    const localizacao = 'Talatona, Bairro Militar';

    const doc = new jsPDF();

    // Adiciona o título do documento
    doc.setFontSize(18);
    doc.text('Detalhes da Marcação', 10, 10);

    // Adiciona o nome da empresa e localização
    doc.setFontSize(14);
    doc.text(`${nomeEmpresa}`, 10, 20);
    doc.text(`${localizacao}`, 10, 30);

    // Adiciona a data de registro
    doc.setFontSize(12);
    doc.text(`Data de Registro: ${this.novaMarcacao.dataRegistro}`, 10, 40);

    // Adiciona o ID da marcação
    doc.text(`ID da Marcação: ${marcacaoId}`, 10, 50);

    // Adiciona os serviços solicitados
    doc.text('Serviços Solicitados:', 10, 60);
    this.servicosSelecionados.forEach((servico, index) => {
      const servicoText = `${index + 1}. Serviço: ${servico.servicoNome}, Profissional: ${servico.profissionalNome}, Data: ${servico.dataHora}, Preço: Kz${servico.preco}`;
      doc.text(servicoText, 10, 70 + (index * 10));
    });

    // Adiciona o total a pagar
    doc.setFontSize(14);
    doc.text(`Total a Pagar: Kz${this.novaMarcacao.totalPagar}`, 10, 70 + (this.servicosSelecionados.length * 10) + 10);

    // Salva o PDF com um nome único (exemplo: marcacao-12345.pdf)
    doc.save(`marcacao-${marcacaoId}.pdf`);
  }
}
