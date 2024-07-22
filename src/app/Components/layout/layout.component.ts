import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Dados } from '../../Interfaces/auth.interface'; // Ajuste conforme necessário

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  currentUser: Dados | null = null;
  isStatusFalse: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: Dados | null) => {
      this.currentUser = user;
      if (user) {
        this.isStatusFalse = !user.status; // Ajuste aqui: isStatusFalse é true se status do usuário é false
        if (this.isStatusFalse) {
          this.router.navigate(['/layout/perfil']); // Redireciona para a tela de perfil
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Adicionando redirecionamento para a tela de login após logout
  }
}
