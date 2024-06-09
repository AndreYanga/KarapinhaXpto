import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgendaMensalComponent } from './agenda-mensal/agenda-mensal.component';
import { AtivarContasComponent } from './ativar-contas/ativar-contas.component';
import { DashboardFinanceiroComponent } from './dashboard-financeiro/dashboard-financeiro.component';
import { GerirAdministrativoComponent } from './gerir-administrativo/gerir-administrativo.component';
import { GerirMarcacoesComponent } from './gerir-marcacoes/gerir-marcacoes.component';
import { GerirProfissionaisComponent } from './gerir-profissionais/gerir-profissionais.component';
import { GerirServicosComponent } from './gerir-servicos/gerir-servicos.component';
import { MinhasMarcacoesComponent } from './minhas-marcacoes/minhas-marcacoes.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { SolicitarMarcacaoComponent } from './solicitar-marcacao/solicitar-marcacao.component';



const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children: [
    {path:'dashboard', component:DashboardComponent},
    {path:'agenda-mensal', component:AgendaMensalComponent},
    {path:'ativar-conta', component:AtivarContasComponent},
    {path:'dashboard-financeiro', component:DashboardFinanceiroComponent},
    {path:'gerir-administrativo', component:GerirAdministrativoComponent},
    {path:'gerir-marcacoes', component:GerirMarcacoesComponent},
    {path:'gerir-profissionais', component:GerirProfissionaisComponent},
    {path:'gerir-servicos', component:GerirServicosComponent},
    {path:'minhas-marcacoes', component:MinhasMarcacoesComponent},
    {path:'perfil', component:PerfilComponent},
    {path:'relatorio', component:RelatorioComponent},
    {path:'solicitar-marcacoes', component:SolicitarMarcacaoComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
