import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteRoutingModule } from './site-routing.module';

import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { ClientComponent } from './client/client.component';
import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { ServicesComponent } from './services/services.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CountsComponent } from './counts/counts.component';
import { TeamComponent } from './team/team.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SiteComponent } from './site.component'; // Certifique-se de que SiteComponent está declarado aqui


@NgModule({
  declarations: [
    SiteComponent,
    HeaderComponent,
    HeroComponent,
    ClientComponent,
    AboutComponent,
    FeaturesComponent,
    ServicesComponent,
    PortfolioComponent,
    CountsComponent,
    TeamComponent,
    ContactComponent,
    FooterComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    SiteRoutingModule
  ]
})
export class SiteModule { }
