import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service'; // Importe o AuthService

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const emailData = {
        para: this.contactForm.get('email')?.value,
        assunto: this.contactForm.get('subject')?.value,
        mensagem: this.contactForm.get('message')?.value
      };

      // Envia o e-mail
      this.authService.enviarEmail_1(emailData).subscribe(
        emailResponse => {
          if (emailResponse.sucesso) {
            console.log('Email de notificação enviado com sucesso:', emailResponse);
            alert('Email de notificação enviado com sucesso!');
            this.contactForm.reset(); // Limpa o formulário após o envio
          } else {
            console.error('Erro ao enviar e-mail de notificação:', emailResponse.mensagem);
            alert('Erro ao enviar e-mail de notificação!');
          }
        },
        emailError => {
          console.error('Erro ao enviar e-mail de notificação:', emailError);
        }
      );
    }
  }
}
