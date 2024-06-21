import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { FirstpageComponent } from './firstpage/firstpage/firstpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AhpComponent } from './ahp/ahp.component';
import { HistoriqueComponent } from './historique/historique.component';
import { FirstguardGuard } from './guards/firstguard.guard';
import  { MethodeComponent } from './methode/methode.component';
import { FahpComponent } from './fahp/fahp.component';
import { ExpertComponent } from './expert/expert.component';



const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'user-profile',     component: ProfileComponent },
    { path: 'register',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'firstpage',          component: FirstpageComponent  , canActivate: [FirstguardGuard]},
    { path: 'methode',          component: MethodeComponent  , canActivate: [FirstguardGuard]},
    { path: 'fahp',          component: FahpComponent  , canActivate: [FirstguardGuard]},
    { path: 'auth',          component: LoginpageComponent },
    { path: 'ahp',          component: AhpComponent , canActivate: [FirstguardGuard] },
    { path: 'historique',          component: HistoriqueComponent , canActivate: [FirstguardGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'expert',          component: ExpertComponent  , canActivate: [FirstguardGuard]},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
