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

    this.authService.updateStatus(usuario.id, novoStatus).subscribe({
      next: (response: any) => {
        if (response.sucesso) {
          usuario.ativo = novoStatus; // Atualiza o status localmente
          alert(`Conta de ${usuario.nomeCompleto} ${novoStatus ? 'ativada' : 'desativada'} com sucesso!`);
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
