import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarMarcacoesService } from '../../../Services/solicitar-marcacoes.service';
import { AuthService } from '../../../Services/auth.service';
import { MarcacaoService } from '../../../Services/marcacao.service';


export interface Servico {
  id: number;
  descricao: string;
  categoriaId: null | number;
  preco: null | number;
}

export interface ServicoResponse {
  dados: Servico[];
  mensagem: string;
  sucesso: boolean;
}

@Component({
  selector: 'app-consultar-agenda',
  templateUrl: './consultar-agenda.component.html',
  styleUrls: ['./consultar-agenda.component.css']
})
export class ConsultarAgendaComponent implements OnInit {
  reagendarForm!: FormGroup;
  servicos: any[] = [];
  horarios: any[] = [];
  dataSelecionada!: Date;
  horaSelecionada!: { hour: number, minute: number };
  servicoAtual: any;
  profissionalId: number | null = null;
  UtilizadorEmail!: string;



  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private solicitacaoService: SolicitarMarcacoesService,
    private authService: AuthService,
    private marcacaoService: MarcacaoService,

  ) {
    this.reagendarForm = this.fb.group({
      data: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.UtilizadorEmail = currentUser.email;
      console.log('peguei email', this.UtilizadorEmail);
    }
    this.obterIdProfissionalPorEmail('profissional1.1@gmail.com'); // Substitua pelo email real

  }

  obterIdProfissionalPorEmail(email: string): void {
    this.solicitacaoService.listarIdProfissionalPorEmail(email).subscribe(response => {
      if (response.sucesso) {
        this.profissionalId = response.dados;

        if (this.profissionalId !== null) {
          this.listarServicosPorProfissionalId(this.profissionalId);
          this.selecionarProfissionalHora(this.profissionalId);
        } else {
          console.error('ID do profissional não encontrado');
        }
      } else {
        console.error('Erro ao obter ID do profissional');
      }
    });
  }

  listarServicosPorProfissionalId(profissionalId: number): void {
    if (profissionalId === null) {
      console.error('ID do profissional é nulo');
      return;
    }

    this.solicitacaoService.listarServicoMarcacaoPorProfissionalId(profissionalId).subscribe(
      (response: ServicoResponse) => {
        if (response.sucesso) {
          if (response.dados.length === 0) {
            // Exibe um alerta quando nenhum serviço é encontrado
            alert('Nenhum serviço encontrado para o profissional selecionado.');
            this.servicos = []; // Defina como um array vazio ou outra lógica apropriada
          } else {
            this.servicos = response.dados;
          }
        } else {
          // Lida com outras mensagens de erro
          console.error('Erro ao obter serviços:', response.mensagem);
          alert(`Erro ao obter serviços: ${response.mensagem}`);
        }
      },
      error => {
        // Lida com erros da requisição
        console.error('Erro na requisição:', error.message);
        alert('Nenhum serviço encontrado para o profissional selecionado.');
      }
    );
  }

  openReagendarModal(servico: any, content: TemplateRef<any>): void {
    this.servicoAtual = servico;
    this.modalService.open(content);
  }

  selecionarData(event: any): void {
    this.dataSelecionada = new Date(event.target.value);
  }

  selecionarHora(event: any): void {
    const horarioId = event.target.value;
    const horarioSelecionado = this.horarios.find(horario => horario.horarioId == horarioId);
    if (horarioSelecionado) {
      const [hour, minute] = horarioSelecionado.horarioDescricao.split(':');
      this.horaSelecionada = {
        hour: parseInt(hour, 10),
        minute: parseInt(minute, 10)
      };
    }
  }

  selecionarProfissionalHora(profissionalId: number): void {
    this.solicitacaoService.listarHorariosPorProfissional(profissionalId).subscribe(
      response => {
        this.horarios = response.dados;
        console.log('carregou');
      },
      error => {
        console.error('Erro ao carregar horários: ', error);
      }
    );
  }

  onReagendarSubmit(): void {
    if (!this.dataSelecionada || !this.horaSelecionada) {
      console.error('Data e hora devem ser selecionadas.');
      return;
    }

    const year = this.dataSelecionada.getFullYear();
    const month = ('0' + (this.dataSelecionada.getMonth() + 1)).slice(-2);
    const day = ('0' + this.dataSelecionada.getDate()).slice(-2);
    const hour = ('0' + this.horaSelecionada.hour).slice(-2);
    const minute = ('0' + this.horaSelecionada.minute).slice(-2);
    const dataHora = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

    const idServico = this.servicoAtual.id;
    console.log('ANTENS DE TUDO:', idServico, dataHora );

       // Agora você pode enviar os dados para o serviço de reagendamento
       this.marcacaoService.reagendarMarcacao(idServico, dataHora).subscribe(
        response => {
          console.log('Marcação reagendada com sucesso:', response);
          alert('Marcação reagendada com sucesso');
          // Aqui você pode adicionar lógica para atualizar a interface após o reagendamento
          this.modalService.dismissAll(); // Fechar o modal após reagendar
          // Atualizar as marcações (se necessário) após reagendar
            this.ngOnInit();
        },
        error => {
          console.error('Erro ao reagendar marcação:', error);
          alert('Erro ao reagendar marcação');

          // Exiba o erro completo no console para depuração
        }
      );
    }

  cancelarServico(idServico: number): void {

  }
}
