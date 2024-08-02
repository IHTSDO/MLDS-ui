import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authguardGuard } from './auth/authguard.guard';
import { LandingContentComponent } from './components/landing-content/landing-content.component';
import { LoginComponent } from './components/login/login.component';
import { MemberManagementComponent } from './components/member-management/member-management.component';
import { CountryComponent } from './components/country/country.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent },
      { path:'register', component: RegisterComponent },
    ]
  },
  {
    path: 'member',
    component: DashboardComponent,
    canActivate: [authguardGuard],
    children: [
      { path: '', redirectTo: 'member', pathMatch: 'full' },
      { path: 'member', component: MemberManagementComponent },
      { path: 'country', component: CountryComponent }
    ]
  },
  {
    path: 'landing/:memberKey',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent },
      { path:'register', component: RegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
