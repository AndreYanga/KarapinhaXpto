import jsPDF from 'jspdf';
import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../Services/categoria.service';
import { SolicitarMarcacoesService } from '../../../Services/solicitar-marcacoes.service';
import { AuthService } from '../../../Services/auth.service';
import { tap } from 'rxjs/operators';

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

  emailUtilizador: string = ''; // Campo para e-mail do usuário
  perfilAtual: string = ''; // Perfil do usuário logado
  salvarEmail: string = ''; // Perfil do usuário logado

  constructor(
    private categoriaService: CategoriaService,
    private solicitacaoService: SolicitarMarcacoesService,
    private authService: AuthService,

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
      this.perfilAtual = currentUser.perfil.descricao; // Atribuir o perfil do usuário logado
    }
  }

  consultarUtilizadorPorEmail() {
    this.salvarEmail = this.emailUtilizador;
    this.authService.buscarPorEmail(this.emailUtilizador).subscribe(
      response => {
        if (response.sucesso) {
          this.novaMarcacao.utilizadorId = response.dados.id;
          alert('Utilizador encontrado');
        } else {
          alert('Utilizador não encontrado');
        }
      },
      error => {
        console.error('Erro ao consultar utilizador por e-mail', error);
      }
    );
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
    if (this.perfilAtual === 'Profissional') {
      this.novaMarcacao.status = true;
    } else {
      this.novaMarcacao.status = false;
    }

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

          this.solicitacaoService.salvarServicoMarcacao(servicoMarcacao).subscribe(
            res => {
              console.log('Serviço de marcação salvo com sucesso', res);
            },
            err => {
              console.error('Erro ao salvar serviço de marcação', err);
            }
          );
        });

        alert('Marcação realizada com sucesso!');

        // Enviar e-mail se o perfil for 'Profissional'
        if (this.perfilAtual === 'Profissional') {
          if (!this.salvarEmail) {
            console.error('E-mail do usuário não definido.');
            return;
          }

          // Configura o e-mail para enviar
          const emailData = {
            para: this.salvarEmail,
            assunto: `Solicitar Marcações`,
            mensagem: `A sua marcação foi solicitada com sucesso.`
          };

          console.log('Enviando e-mail para:', this.salvarEmail);

          // Envia o e-mail
          this.authService.enviarEmail_2(emailData).subscribe(
            emailResponse => {
              if (emailResponse.sucesso) {
                console.log('Email de notificação enviado com sucesso:', emailResponse);
                alert('Email de notificação enviado com sucesso!');
              } else {
                console.error('Erro ao enviar e-mail de notificação:', emailResponse.mensagem);
                alert(`Erro ao enviar e-mail de notificação: ${emailResponse.mensagem}`);
              }
            },
            emailError => {
              console.error('Erro ao enviar e-mail de notificação:', emailError);
              alert(`Erro ao enviar e-mail de notificação: ${emailError.message}`);
            }
          );
        }

        this.resetarFormulario();
      },
      error => {
        console.error('Erro ao registrar marcação', error);
        alert('Erro ao realizar a marcação.');
      }
    );
  }


  resetarFormulario(): void {
    this.servicoSelecionado = null;
    this.categorias = [];
    this.servicos = [];
    this.profissionais = [];
    this.horarios = [];
    this.servicosSelecionados = [];
    this.novaMarcacao = {
      dataRegistro: new Date().toISOString(),
      totalPagar: 0,
      status: true,
      utilizadorId: 0
    };
    this.novoServicoMarcacao = {
      servicoId: null,
      marcacaoId: null,
      categoriaId: null,
      profissionalId: null,
      data: null,
      hora: null
    };
    this.emailUtilizador = '';
    this.perfilAtual = '';
  }




}
