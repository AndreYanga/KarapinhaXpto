import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SolicitarMarcacaoComponent } from './pages/user/solicitar-marcacao/solicitar-marcacao.component';
import { MinhasMarcacoesComponent } from './pages/user/minhas-marcacoes/minhas-marcacoes.component';
import { PerfilComponent } from './pages/user/perfil/perfil.component';
import { AtivarContasComponent } from './pages/admin/ativar-contas/ativar-contas.component';
import { GerirAdministrativoComponent } from './pages/admin/gerir-administrativo/gerir-administrativo.component';
import { RelatorioComponent } from './pages/admin/relatorio/relatorio.component';
import { DashboardFinanceiroComponent } from './pages/administrativo/dashboard-financeiro/dashboard-financeiro.component';
import { GerirProfissionaisComponent } from './pages/administrativo/gerir-profissionais/gerir-profissionais.component';
import { GerirServicosTratamentoComponent } from './pages/administrativo/gerir-servicos-tratamento/gerir-servicos-tratamento.component';
import { GerirMarcacoesComponent } from './pages/administrativo/gerir-marcacoes/gerir-marcacoes.component';
import { AgendaMensalComponent } from './pages/administrativo/agenda-mensal/agenda-mensal.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SolicitarMarcacaoComponent,
    MinhasMarcacoesComponent,
    PerfilComponent,
    AtivarContasComponent,
    GerirAdministrativoComponent,
    RelatorioComponent,
    DashboardFinanceiroComponent,
    GerirProfissionaisComponent,
    GerirServicosTratamentoComponent,
    GerirMarcacoesComponent,
    AgendaMensalComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
