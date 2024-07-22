import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfissionalService } from '../../../Services/profissional.service';
import { AuthService } from '../../../Services/auth.service';

import { RegisterRequest } from '../../../Interfaces/register.interface';

interface Horario {
  id: number;
  descricao: string;
}

interface Servico {
  id: number;
  descricao: string;
}

@Component({
  selector: 'app-gerir-profissionais',
  templateUrl: './gerir-profissionais.component.html',
  styleUrls: ['./gerir-profissionais.component.css']
})
export class GerirProfissionaisComponent implements OnInit {

  horariosTrabalho: Horario[] = [];
  servicos: Servico[] = [];
  horariosSelecionados: Horario[] = [];
  novoHorario: number | null = null;
  novoServico: number | null = null;

  // Propriedades para cadastro de profissionais
  nomeProfissional: string = '';
  email: string = '';
  bi: string = '';
  telefone: string = '';
  fotoProfissional: File | null = null;

  // Listagem de profissionais
  profissionais: any[] = [];

  constructor(
    private http: HttpClient,
    private profissionalService: ProfissionalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarHorario();
    this.carregarServicos();
    this.listarProfissionais();
  }

  carregarHorario(): void {
    this.profissionalService.obterHorariosTrabalho().subscribe(response => {
      if (response.sucesso) {
        this.horariosTrabalho = response.dados;
        console.log('Horários carregados:', this.horariosTrabalho);
      } else {
        console.error('Erro ao carregar horários:', response.mensagem);
      }
    }, error => {
      console.error('Erro na solicitação:', error);
    });
  }

  carregarServicos(): void {
    this.profissionalService.obterServicos().subscribe(
      response => {
        if (response.sucesso) {
          this.servicos = response.dados;
          console.log('Serviços carregados:', this.servicos);

          // Após carregar os serviços, listar os profissionais
          this.listarProfissionais();
        } else {
          console.error('Erro ao carregar serviços:', response.mensagem);
        }
      },
      error => {
        console.error('Erro na solicitação de serviços:', error);
      }
    );
  }

  adicionarHorario(): void {
    if (this.novoHorario !== null) {
      const horarioId = Number(this.novoHorario);
      const horario = this.horariosTrabalho.find(h => h.id === horarioId);

      if (horario) {
        this.horariosSelecionados.push(horario);
        console.log('Horário adicionado:', horario);
        console.log('Horários selecionados:', this.horariosSelecionados);
      } else {
        console.log('Horário não encontrado na lista de horários disponíveis');
      }
      this.novoHorario = null;
    } else {
      console.log('Nenhum horário selecionado');
    }
  }

  removerHorario(horario: Horario): void {
    this.horariosSelecionados = this.horariosSelecionados.filter(h => h.id !== horario.id);
  }

  // Método para selecionar arquivo de foto
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.fotoProfissional = event.target.files[0] as File;
    }
  }

  adicionarProfissional(): void {
    // Monta os dados para cadastro
    const dadosProfissional = {
      Nome: this.nomeProfissional,
      Email: this.email,
      BI: this.bi,
      Telefone: this.telefone,
      ServicoId: this.novoServico || 0, // Substitua pelo ID do serviço selecionado
      Foto: this.fotoProfissional
    };

    this.profissionalService.cadastrarProfissional(dadosProfissional).subscribe(
      response => {
        console.log('Profissional cadastrado com sucesso:', response);
        alert('Profissional cadastrado com sucesso');
        // Após o cadastro, pesquisa o ID do profissional pelo e-mail
        // Após o cadastro do profissional, registrar o usuário

        this.obterIdProfissionalPorEmail(this.email);
        this.registrarUtilizador();
      },
      error => {
        console.error('Erro ao cadastrar profissional:', error);
        alert('Erro ao cadastrar profissional');
      }
    );
  }

  obterIdProfissionalPorEmail(email: string): void {
    this.profissionalService.obterIdProfissionalPorEmail(email).subscribe(
      response => {
        if (response.sucesso && response.dados) {
          const profissionalId = response.dados;
          console.log('ID do Profissional:', profissionalId);

          // Após obter o ID do profissional, cadastra os horários selecionados
          this.cadastrarHorariosProfissional(profissionalId);
        } else {
          console.error('Erro ao obter ID do profissional:', response.mensagem);
        }
      },
      error => {
        console.error('Erro na solicitação:', error);
      }
    );
  }

  cadastrarHorariosProfissional(profissionalId: number): void {
    // Itera sobre os horários selecionados para enviar um por um
    this.horariosSelecionados.forEach(horario => {
      const dadosHorario = {
        profissionalId: profissionalId,
        horarioId: horario.id
      };

      this.profissionalService.cadastrarHorarioProfissional(dadosHorario).subscribe(
        response => {
          console.log(`Horário ${horario.id} cadastrado para o profissional ${profissionalId}:`, response);
          // Você pode adicionar aqui uma lógica para gerenciar o sucesso individual de cada cadastro

        },
        error => {
          console.error(`Erro ao cadastrar horário ${horario.id} para o profissional ${profissionalId}:`, error);
          // Você pode adicionar aqui uma lógica para gerenciar os erros individualmente
        }
      );
    });

    // Após o loop, você pode adicionar uma lógica de conclusão, por exemplo:
    alert('Horários cadastrados para o profissional');

  }

  listarProfissionais(): void {
    this.profissionalService.listarProfissionais().subscribe(
      response => {
        if (response.sucesso) {
          this.profissionais = response.dados;

          // Associar os serviços aos profissionais
          this.associarServicosAosProfissionais();
        } else {
          console.error('Erro ao carregar profissionais:', response.mensagem);
        }
      },
      error => {
        console.error('Erro na solicitação de profissionais:', error);
      }
    );
  }

  associarServicosAosProfissionais(): void {
    this.profissionais.forEach(profissional => {
      profissional.servico = this.servicos.find(servico => servico.id === profissional.servicoId);
    });
  }

  limparCampos(): void {
    this.nomeProfissional = '';
    this.email = '';
    this.bi = '';
    this.telefone = '';
    this.novoServico = null;
    this.fotoProfissional = null;
    this.horariosSelecionados = []; // Limpar horários selecionados
  }


  registrarUtilizador(): void {
    const username = gerarNomeUsuario(this.nomeProfissional);
    const senha = gerarSenha();

    const dadosRegistro: RegisterRequest = {
      nomeCompleto: this.nomeProfissional,
      email: this.email,
      telemovel: this.telefone,
      foto: this.fotoProfissional,
      bi: this.bi,
      userName: username,
      password: senha,
      perfilId: 1002,
      ativo: true,
      status: false
    };

    this.authService.register(dadosRegistro).subscribe(
      utilizadorResponse => {
        console.log('Usuário registrado com sucesso:', utilizadorResponse);
        alert(`Usuário registrado com sucesso!\nUsername: ${username}\nSenha: ${senha}`);

        const emailData = {
          para: this.email,
          assunto: 'Bem-vindo ao Sistema',
          mensagem: `Olá ${this.nomeProfissional},\n\nSuas credenciais de acesso são:\nUsername: ${username}\nSenha: ${senha}\n\nPor favor, altere sua senha após o primeiro login.`
        };
        console.log('Enviando dados de email:', emailData);

         // Enviar email de reagendamento
         this.authService.enviarEmail_1(emailData).subscribe(
          emailResponse => {
            if (emailResponse.sucesso) {
              console.log('Email enviado com sucesso:', emailResponse);
              alert('Email enviado com sucesso');
              this.limparCampos();
              this.ngOnInit();
            } else {
              console.error('Erro ao enviar email:', emailResponse.mensagem);
              alert('Erro ao enviar email');
            }
          },
          emailError => {
            console.error('Erro ao enviar email:', emailError);
            alert('Erro ao enviar email');
          }
        );
      },
      error => {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário');
      }
    );
  }

}

function gerarNomeUsuario(nomeProfissional: string): string {
  const randomNumber = Math.floor(Math.random() * 10000);
  const username = nomeProfissional.split(' ')[0].toLowerCase() + randomNumber;
  return username;
}

function gerarSenha(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let senha = '';
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    senha += chars[randomIndex];
  }
  return senha;
}
