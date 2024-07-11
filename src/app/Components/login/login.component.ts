import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { LoginRequest, LoginResponse } from '../../Interfaces/auth.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = { userName: '', password: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login successful:', response);
        this.handleLoginSuccess(response);
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        if (error.status === 403 && error.error?.mensagem === 'Sua conta ainda não está ativada.') {
          this.errorMessage = 'Sua conta ainda não está ativada.';
          alert('Sua conta ainda não está ativada.'); // Exibindo alerta em caso de conta não ativada
        } else {
          this.errorMessage = 'Nome de usuário ou senha incorretos';
          alert('Nome de usuário ou senha incorretos'); // Exibindo alerta em caso de usuário/senha incorretos
        }
      },
      complete: () => {
        console.log('Login request completed');
      }
    });
  }

  private handleLoginSuccess(response: LoginResponse): void {
    const perfilId = response.dados?.perfilId; // Exemplo de acesso ao perfilId dentro dos dados

    if (perfilId === undefined || perfilId === null) {
      // Caso perfilId não seja encontrado ou seja inválido
      console.warn('PerfilId não encontrado ou inválido:', response);
      this.router.navigate(['/layout/dashboard']); // Rota padrão para qualquer outro caso não tratado
      return;
    }

    switch (perfilId){
      case 1: // Perfil de administrador
        this.router.navigate(['/layout/dashboard']); // Rota para o dashboard do administrador
        break;
      case 2: // Perfil de administrativo
        this.router.navigate(['/layout/dashboard']); // Rota para o dashboard do administrativo
        break;
      case 3: // Perfil de usuário comum
        this.router.navigate(['/layout/solicitar-marcacoes']); // Rota para do usuário comum
        break;
      default:
        this.router.navigate(['/layout']); // Rota padrão para outros perfis
        break;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
