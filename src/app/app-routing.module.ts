import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './Components/site/site.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';


const routes: Routes = [
  {path:'', component:SiteComponent, pathMatch:"full"},
  {path:'site', loadChildren:() => import("./Components/site/site.module").then(m => m.SiteModule)},
  {path:'login', component:LoginComponent, pathMatch:"full"},
  {path:'register', component:RegisterComponent, pathMatch:"full"},
  {path:'layout', loadChildren:() => import("./Components/layout/layout.module").then(m => m.LayoutModule)},
  {path:'**', redirectTo:'site',pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
