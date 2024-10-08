import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importação do ReactiveFormsModule

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolicitarMarcacaoComponent } from './solicitar-marcacao/solicitar-marcacao.component';
import { MinhasMarcacoesComponent } from './minhas-marcacoes/minhas-marcacoes.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AtivarContasComponent } from './ativar-contas/ativar-contas.component';
import { GerirAdministrativoComponent } from './gerir-administrativo/gerir-administrativo.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { DashboardFinanceiroComponent } from './dashboard-financeiro/dashboard-financeiro.component';
import { GerirProfissionaisComponent } from './gerir-profissionais/gerir-profissionais.component';
import { GerirServicosComponent } from './gerir-servicos/gerir-servicos.component';
import { GerirMarcacoesComponent } from './gerir-marcacoes/gerir-marcacoes.component';
import { AgendaMensalComponent } from './agenda-mensal/agenda-mensal.component';
import { LayoutComponent } from './layout.component';
import { GerirCategoriasComponent } from './gerir-categorias/gerir-categorias.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    SolicitarMarcacaoComponent,
    MinhasMarcacoesComponent,
    PerfilComponent,
    AtivarContasComponent,
    GerirAdministrativoComponent,
    RelatorioComponent,
    DashboardFinanceiroComponent,
    GerirProfissionaisComponent,
    GerirServicosComponent,
    GerirMarcacoesComponent,
    AgendaMensalComponent,
    GerirCategoriasComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule // Adição do ReactiveFormsModule
  ]
})
export class LayoutModule { }
