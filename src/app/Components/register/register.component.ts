import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { RegisterRequest } from '../../Interfaces/register.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    nomeCompleto: '',
    email: '',
    telemovel: '',
    foto: null,
    bi: '',
    userName: '',
    password: '',
    perfilId: 3,
    ativo: false,
    status: true
  };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Usuário registrado com sucesso:', response);
        alert('Usuário registrado com sucesso!');
        // Redirecione ou execute outras ações após o registro bem-sucedido
        this.router.navigate(['/login']); // Exemplo de redirecionamento para a página de login
      },
      error: (error) => {
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.registerData.foto = file;
  }
}
