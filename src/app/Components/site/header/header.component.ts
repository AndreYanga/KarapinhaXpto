import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user; // Verifica se há um usuário logado
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
