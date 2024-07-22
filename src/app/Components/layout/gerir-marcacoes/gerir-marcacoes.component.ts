import { Component, OnInit } from '@angular/core';
import { MarcacaoService } from '../../../Services/marcacao.service';
import { AuthService } from '../../../Services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';
import { SolicitarMarcacoesService } from '../../../Services/solicitar-marcacoes.service';
import { GerirMarcacoesService } from '../../../Services/gerir-marcacoes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerir-marcacoes',
  templateUrl: './gerir-marcacoes.component.html',
  styleUrl: './gerir-marcacoes.component.css'
})
export class GerirMarcacoesComponent implements OnInit {
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
    private gerirMarcacoesService: GerirMarcacoesService,
    private router: Router // Injete o Router aqui
  ) {
    this.reagendarForm = this.fb.group({
      data: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarMarcacoes();
  }

  listarMarcacoes(): void {
    this.gerirMarcacoesService.ListarTodasMarcacoes().subscribe(response => {
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

        // Pegar o utilizadorId da marcação e buscar o email do utilizador
        this.gerirMarcacoesService.getUtilizadorPorId(this.marcacaoAtual.marcacao.utilizadorId).subscribe(
          utilizadorResponse => {
            const email = utilizadorResponse.dados.email;
            console.log('o email:', email);
            const emailData = {
              para: email,
              assunto: 'Reagendamento de Marcação',
              mensagem: `A sua marcação foi reagendada com sucesso para ${day}/${month}/${year} às ${hour}:${minute}.`
            };

            // Enviar email de reagendamento
            this.gerirMarcacoesService.enviarEmail(emailData).subscribe(
              emailResponse => {
                if (emailResponse.sucesso) {
                  console.log('Email de reagendamento enviado com sucesso:', emailResponse);
                  alert('Email de reagendamento enviado com sucesso');
                  this.ngOnInit();
                } else {
                  console.error('Erro ao enviar email de reagendamento:', emailResponse.mensagem);
                  alert('Erro ao enviar email de reagendamento');
                }
              },
              emailError => {
                console.error('Erro ao enviar email de reagendamento:', emailError);
                alert('Erro ao enviar email de reagendamento');
              }
            );
          },
          utilizadorError => {
            console.error('Erro ao buscar email do utilizador:', utilizadorError);
            alert('Erro ao buscar email do utilizador');
          }
        );
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

        // Verificar se this.marcacaoAtual e this.marcacaoAtual.marcacao estão definidos
        if (this.marcacaoAtual && this.marcacaoAtual.marcacao) {
          // Pegar o utilizadorId da marcação e buscar o email do utilizador
          this.gerirMarcacoesService.getUtilizadorPorId(this.marcacaoAtual.marcacao.utilizadorId).subscribe(
            utilizadorResponse => {
              const email = utilizadorResponse.dados.email;
              console.log('o email:', email);
              const emailData = {
                para: email,
                assunto: 'Cancelamento de Marcação',
                mensagem: `A sua marcação foi cancelada com sucesso.`
              };

              // Enviar email de cancelamento
              this.gerirMarcacoesService.enviarEmail(emailData).subscribe(
                emailResponse => {
                  if (emailResponse.sucesso) {
                    console.log('Email de cancelamento enviado com sucesso:', emailResponse);
                    alert('Email de cancelamento enviado com sucesso');
                    this.ngOnInit();
                  } else {
                    console.error('Erro ao enviar email de cancelamento:', emailResponse.mensagem);
                    alert('Erro ao enviar email de cancelamento');
                  }
                },
                emailError => {
                  console.error('Erro ao enviar email de cancelamento:', emailError);
                  alert('Erro ao enviar email de cancelamento');
                }
              );
            },
            utilizadorError => {
              console.error('Erro ao buscar email do utilizador:', utilizadorError);
              alert('Erro ao buscar email do utilizador');
            }
          );
        } else {
          console.error('Erro: marcacaoAtual ou marcacaoAtual.marcacao não está definido');
          alert('Erro ao tentar enviar o email de cancelamento');
        }

        this.ngOnInit();
      },
      error => {
        console.error('Erro ao cancelar marcação:', error);
        alert('Erro ao cancelar marcação');
      }
    );
  }


  confirmarMarcacao(marcacao: any): void {
    this.gerirMarcacoesService.confirmarMarcacao(marcacao.id).subscribe(
      response => {
        if (response.sucesso) {
          console.log('Marcação confirmada com sucesso:', response);
          alert('Marcação confirmada com sucesso');

          // Pegar o utilizadorId da marcação e buscar o email do utilizador
          this.gerirMarcacoesService.getUtilizadorPorId(marcacao.utilizadorId).subscribe(
            utilizadorResponse => {
              const email = utilizadorResponse.dados.email;
              console.log('o email:', email);
              const emailData = {
                para: email,
                assunto: 'Confirmação de Marcação',
                mensagem: `A sua marcação foi confirmada com sucesso.`
              };

              // Enviar email de confirmação
              this.gerirMarcacoesService.enviarEmail(emailData).subscribe(
                emailResponse => {
                  if (emailResponse.sucesso) {
                    console.log('Email de confirmação enviado com sucesso:', emailResponse);
                    alert('Email de confirmação enviado com sucesso');
                    this.ngOnInit();
                  } else {
                    console.error('Erro ao enviar email de confirmação:', emailResponse.mensagem);
                    alert('Erro ao enviar email de confirmação');
                  }
                },
                emailError => {
                  console.error('Erro ao enviar email de confirmação:', emailError);
                  alert('Erro ao enviar email de confirmação');
                }
              );
            },
            utilizadorError => {
              console.error('Erro ao buscar email do utilizador:', utilizadorError);
              alert('Erro ao buscar email do utilizador');
            }
          );

          this.ngOnInit();
        } else {
          console.error('Erro ao confirmar marcação:', response.mensagem);
          alert('Erro ao confirmar marcação');
        }
      },
      error => {
        console.error('Erro ao confirmar marcação:', error);
        alert('Erro ao confirmar marcação');
      }
    );
  }
}
