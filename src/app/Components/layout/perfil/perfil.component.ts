import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Dados } from '../../../Interfaces/auth.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuarioLogado: Dados | null = null;
  profileForm: FormGroup;
  changePasswordForm: FormGroup; // Adicionando o FormGroup para alteração de senha

  profissionalId: number | null = null;
  perfilAtual: string = ''; // Perfil do usuário logado

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      id: [''],
      nomeCompleto: [''],
      userName: [''],
      telemovel: [''],
      email: [''],
      bi: [''],
      password: [''],
      perfilId: [''],
      ativo: [false],
      status: [false],
      foto: [null]
    });

    // Inicializando o FormGroup para alteração de senha
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      renewPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.currentUserValue;
    if (this.usuarioLogado) {
        this.perfilAtual =  this.usuarioLogado.perfil.descricao;
        this.profileForm.patchValue({
        id: this.usuarioLogado.id,
        nomeCompleto: this.usuarioLogado.nomeCompleto,
        userName: this.usuarioLogado.userName,
        telemovel: this.usuarioLogado.telemovel,
        email: this.usuarioLogado.email,
        bi: this.usuarioLogado.bi,
        perfilId: this.usuarioLogado.perfilId,
        ativo: this.usuarioLogado.ativo,
        status: this.usuarioLogado.status


      });
    }


    if (this.perfilAtual === 'Profissional') {
          if (this.usuarioLogado && this.usuarioLogado.email) {
            console.log('ANTES DE TUDO.',this.usuarioLogado.email);
            this.authService.verificarPerfil(this.usuarioLogado.email).subscribe(response => {
              if (response.sucesso) {
                this.profissionalId = response.dados;
                console.log('ANTES DE TUDO.',this.profissionalId);
              }
            });
          } else {
            // Lidar com o caso onde o usuário logado é nulo
            console.error('Usuário logado não está disponível.');
          }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.patchValue({ foto: file });
    }
  }

  updateProfile(): void {
    if (!this.usuarioLogado) {
      console.error('Dados do usuário não foram carregados.');
      return;
    }

    const formData = this.profileForm.value;
    formData.id = this.usuarioLogado.id;

    this.authService.updateProfile(formData).subscribe(
      response => {
        console.log('Perfil atualizado com sucesso', response);
        alert('Perfil atualizado com sucesso!');  // Adicionando o alerta aqui

        if (this.perfilAtual === 'Profissional'){
              // Atualiza o profissional se o perfil for Profissional
              if (this.profissionalId) {
                this.authService.atualizarProfissional(this.profissionalId, formData).subscribe(profissionalResponse => {
                  if (profissionalResponse.sucesso) {
                    console.log('Profissional atualizado com sucesso', profissionalResponse);
                    alert('Profissional atualizado com sucesso!');
                  } else {
                    console.error('Erro ao atualizar profissional', profissionalResponse);
                    alert('Erro ao atualizar profissional!');
                  }
                });
              }
          }
      },
      error => {
        console.error('Erro ao atualizar perfil', error);
      }
    );
  }

  changePassword(): void {
    if (!this.usuarioLogado) {
      console.error('Dados do usuário não foram carregados.');
      return;
    }

    // Salvar o estado atual do status do usuário
    const estado = this.usuarioLogado.status;
    const formData = {
      id: this.usuarioLogado.id,
      password: this.changePasswordForm.get('newPassword')?.value, // Nova senha aqui
      status: true // Atualiza o status para true
    };

      // Atualiza o status localmente
     this.usuarioLogado.status = true;

      this.authService.updateProfile(formData).subscribe(
      response => {
        console.log('Senha atualizada com sucesso', response);
        window.alert('Senha atualizada com sucesso!'); // Adicionando o alerta aqui
        this.changePasswordForm.reset(); // Limpa o formulário após sucesso


        // Verifica o status e redireciona se necessário
        if (estado === false) {

          this.router.navigate(['/login']); // Redireciona para a tela de login
        }
      },
      error => {
        console.error('Erro ao atualizar senha', error);
      }
    );
  }

}
