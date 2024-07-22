import { Component, OnInit } from '@angular/core';
import { SiteCategoriaService } from '../../../Services/site-categoria.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  professionals: any[] = [];

  constructor(private dataService: SiteCategoriaService) { }

  ngOnInit(): void {
    this.loadProfessionals();
  }

  loadProfessionals(): void {
    this.dataService.getProfessionals().subscribe(response => {
      if (response.sucesso) {
        this.professionals = response.dados.map((professional: any) => ({
          ...professional,
          fotoUrl: professional.foto.replace('https://localhost:7075/images/', 'https://localhost:7075/assets/images/'),
          servico: null // Inicializa como nulo, será preenchido depois
        }));

        // Carregar serviços associados para cada profissional
        this.professionals.forEach(professional => {
          if (professional.servicoId) {
            this.dataService.getServicoById(professional.servicoId).subscribe(servicoResponse => {
              if (servicoResponse.sucesso) {
                professional.servico = servicoResponse.dados;
              } else {
                console.error('Falha ao buscar serviço:', servicoResponse.mensagem);
              }
            }, error => {
              console.error('Erro ao buscar serviço:', error);
            });
          }
        });
      } else {
        console.error('Falha ao buscar profissionais:', response.mensagem);
      }
    }, error => {
      console.error('Erro ao buscar profissionais:', error);
    });
  }
}
