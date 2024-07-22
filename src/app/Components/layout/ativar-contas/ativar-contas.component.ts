import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ativar-contas',
  templateUrl: './ativar-contas.component.html',
  styleUrls: ['./ativar-contas.component.css']
})
export class AtivarContasComponent implements OnInit {
  usuarios: any[] = [];
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.carregarUsuariosPendentes();
  }

  carregarUsuariosPendentes(): void {
    this.authService.listUsuariosPendentes().subscribe(response => {
      this.usuarios = response.dados.filter((user: any) => user.perfilId === 3);
    })
  }


  toggleStatus(usuario: any): void {
    const novoStatus = !usuario.ativo; // Inverte o status atual

    // Atualiza o status do usuário
    this.authService.updateStatus(usuario.id, novoStatus).subscribe({
      next: (response: any) => {
        if (response.sucesso) {
          usuario.ativo = novoStatus; // Atualiza o status localmente
          alert(`Conta de ${usuario.nomeCompleto} ${novoStatus ? 'ativada' : 'desativada'} com sucesso!`);

          // Configura o e-mail para enviar
          const emailData = {
            para: usuario.email,
            assunto: `Conta ${novoStatus ? 'Ativada' : 'Desativada'}`,
            mensagem: `Sua conta foi ${novoStatus ? 'ativada' : 'desativada'} com sucesso.`
          };

          // Envia o e-mail
          this.authService.enviarEmail_1(emailData).subscribe(
            emailResponse => {
              if (emailResponse.sucesso) {
                console.log('Email de notificação enviado com sucesso:', emailResponse);
                alert(`Email de notificação enviado com sucesso!`);
              } else {
                console.error('Erro ao enviar e-mail de notificação:', emailResponse.mensagem);
                alert(`Erro ao enviar e-mail de notificação!`);
              }
            },
            emailError => {
              console.error('Erro ao enviar e-mail de notificação:', emailError);
            }
          );

        } else {
          alert('Erro ao alterar status da conta. Por favor, tente novamente.');
        }
      },
      error: (error: HttpErrorResponse) => {
        alert('Erro ao alterar status da conta. Por favor, tente novamente.');
        console.error('Erro ao alterar status da conta:', error);
      }
    });
  }


}
