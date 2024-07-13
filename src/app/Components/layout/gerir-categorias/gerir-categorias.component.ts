import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../Services/categoria.service';

@Component({
  selector: 'app-gerir-categorias',
  templateUrl: './gerir-categorias.component.html',
  styleUrls: ['./gerir-categorias.component.css']
})
export class GerirCategoriasComponent implements OnInit {
  categorias: any[] = [];
  novaCategoria: any = {
    nome: '',
    descricao: '',
    foto: null
  };
  alerta: string = '';

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(response => {
      this.categorias = response.dados;
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.novaCategoria.foto = event.target.files[0];
    }
  }

  adicionarCategoria(): void {
    this.categoriaService.adicionarCategoria(this.novaCategoria).subscribe(response => {
      if (response.sucesso) {
        this.carregarCategorias();
        this.novaCategoria = {
          nome: '',
          descricao: '',
          foto: null
        };
         alert('Categoria cadastrada com sucesso!');
      } else {
        alert( 'Erro ao cadastrar categoria. Por favor, tente novamente.');
      }
    }, error => {
       alert('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
    });
  }

 
}
