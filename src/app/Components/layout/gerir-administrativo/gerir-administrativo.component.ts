import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { RegisterRequest } from '../../../Interfaces/register.interface';

@Component({
  selector: 'app-gerir-administrativo',
  templateUrl: './gerir-administrativo.component.html',
  styleUrls: ['./gerir-administrativo.component.css']
})
export class GerirAdministrativoComponent implements OnInit {
  newUser: RegisterRequest = {
    nomeCompleto: '',
    email: '',
    telemovel: '',
    foto: null, // Alterado para aceitar File ou null
    bi: '',
    userName: '',
    password: '',
    perfilId: 2,
    ativo: true,
    status: true
  };
  administrativos: any[] = [];
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAdministrativos();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newUser.foto = file;
    }
  }

  register(): void {
    this.authService.register(this.newUser).subscribe({
      next: (response: any) => {
        if (response.sucesso) {
          this.loadAdministrativos();
          alert('Administrativo registrado com sucesso!');
          this.clearForm();
        }
      },
      error: (error: any) => {
        console.error('Erro ao registrar usuário:', error);

        if (error.error && error.error.mensagem) {
          if (error.error.mensagem === 'E-mail já está em uso.') {
            this.errorMessage = 'Este e-mail já está em uso. Por favor, use outro e-mail.';
            alert('Este e-mail já está em uso. Por favor, use outro e-mail.');
          } else if (error.error.mensagem === 'Nome de usuário já está em uso.') {
            this.errorMessage = 'Este nome de usuário já está em uso. Por favor, use outro nome de usuário.';
            alert('Este nome de usuário já está em uso. Por favor, use outro nome de usuário.');
          } else {
            this.errorMessage = 'Erro ao criar conta. Por favor, tente novamente.';
            alert('Erro ao criar conta. Por favor, tente novamente.');
          }
        } else {
          this.errorMessage = 'Erro ao criar conta. Por favor, tente novamente.';
          alert('Erro ao criar conta. Por favor, tente novamente.');
        }
      }
    });
  }


  loadAdministrativos(): void {
    this.authService.listAdministrativos().subscribe(response => {
      this.administrativos = response.dados.filter((user: any) => user.perfilId === 2);
    });
  }

  toggleStatus(id: number, currentStatus: boolean): void {
    this.authService.updateStatus(id, !currentStatus).subscribe({
      next: (response: any) => {
        if (response.sucesso) {
          this.loadAdministrativos();
          alert('Status atualizado com sucesso!');
        }
      },
      error: (error: any) => {
        console.error('Erro ao atualizar status:', error);
        if (error.error && error.error.mensagem) {
          this.errorMessage = error.error.mensagem;
        } else {
          this.errorMessage = 'Erro ao atualizar status. Por favor, tente novamente.';
        }
      }
    });
  }

  clearForm(): void {
    this.newUser = {
      nomeCompleto: '',
      email: '',
      telemovel: '',
      foto: null, // Limpar foto ao limpar o formulário
      bi: '',
      userName: '',
      password: '',
      perfilId: 2,
      ativo: true,
      status: true
    };
    this.errorMessage = ''; // Limpar mensagem de erro ao limpar o formulário
  }
}
