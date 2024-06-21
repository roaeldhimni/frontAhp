import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { FirstpageComponent } from './firstpage/firstpage/firstpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AhpComponent } from './ahp/ahp.component';

import {TabViewModule} from 'primeng/tabview';
import {TabMenuModule} from 'primeng/tabmenu';
import {OrganizationChartModule} from 'primeng/organizationchart';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { HistoriqueComponent } from './historique/historique.component';
import { MethodeComponent } from './methode/methode.component';
import { FahpComponent } from './fahp/fahp.component';
import { ExpertComponent } from './expert/expert.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    FirstpageComponent,
    LoginpageComponent,
    AhpComponent,
    HistoriqueComponent,
    MethodeComponent,
    FahpComponent,
    ExpertComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    TabViewModule,
    TabMenuModule,
    HomeModule,
    NgxOrgChartModule ,
    HttpClientModule,
    OrganizationChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
