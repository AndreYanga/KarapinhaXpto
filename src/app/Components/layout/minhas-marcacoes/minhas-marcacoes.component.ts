import { Component, OnInit } from '@angular/core';
import { MarcacaoService } from '../../../Services/marcacao.service';
import { AuthService } from '../../../Services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';
import { SolicitarMarcacoesService } from '../../../Services/solicitar-marcacoes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minhas-marcacoes',
  templateUrl: './minhas-marcacoes.component.html',
  styleUrls: ['./minhas-marcacoes.component.css']
})
export class MinhasMarcacoesComponent implements OnInit {
  dataSelecionada!: Date;
 horaSelecionada!: { hour: number, minute: number };

  reagendarForm!: FormGroup;
  marcacaoAtual: any;
  marcacoes: any[] = [];
  servicosPorMarcacao: { [key: number]: any[] } = {};
  utilizadorId: number = 0;
  marcacaoSelecionada: any;
  horarios: any[] = [];
  profissionalId: number | null = null;
  profissionalSelecionadoId: number | null = null; // Atributo para armazenar o ID do profissional selecionado

  constructor(
    private marcacaoService: MarcacaoService,
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private solicitacaoService: SolicitarMarcacoesService,
    private router: Router // Injete o Router aqui
  ) {
    this.reagendarForm = this.fb.group({
      data: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

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

  openReagendarModal(marcacao: any, servico: any, content: TemplateRef<any>): void {
    this.marcacaoAtual = { marcacao, servico };
    this.modalService.open(content);
  }

  selecionarData(event: any): void {
    this.dataSelecionada = new Date(event.target.value);
  }

  selecionarHora(event: any): void {
    const horarioId = event.target.value;
    console.log('Horário selecionado ID:', horarioId);

    const horarioSelecionado = this.horarios.find(horario => horario.horarioId == horarioId);
    if (horarioSelecionado) {
      const [hour, minute] = horarioSelecionado.horarioDescricao.split(':');
      this.horaSelecionada = {
        hour: parseInt(hour, 10),
        minute: parseInt(minute, 10)
      };
      console.log('Horário selecionado:', this.horaSelecionada);
    } else {
      console.log('Nenhum horário encontrado para o ID:', horarioId);
    }
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
    console.log('dataHora antes de ser enviado', dataHora);
    const idServico = this.marcacaoAtual.servico.id; // Substitua com o ID correto da marcação a ser reagendada

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


  selecionarProfissional(profissionalId: number): void {
    this.profissionalSelecionadoId = profissionalId; // Armazenar o ID do profissional selecionado
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



  cancelarMarcacao(idServico: number): void {
    this.marcacaoService.cancelarMarcacao(idServico).subscribe(
      response => {
        console.log('Marcação cancelada com sucesso:', response);
        alert('Marcação cancelada com sucesso');
        this.ngOnInit();
        // Atualize as marcações após cancelar (se necessário)
      },
      error => {
        console.error('Erro ao cancelar marcação:', error);
        alert('Erro ao cancelar marcação');
        // Trate o erro conforme necessário (ex: exiba mensagem de erro)
      }
    );
  }

}
