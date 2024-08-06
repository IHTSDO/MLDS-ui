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
import { ReleaseFileDownloadCountComponent } from './components/release-file-download-count/release-file-download-count.component';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BlocklistDomainComponent } from './components/blocklist-domain/blocklist-domain.component';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'requestPasswordReset', component: RequestPasswordResetComponent },
      { path: 'resetPassword', component: ResetPasswordComponent }
    ]
  },
  {
    path: 'member',
    component: DashboardComponent,
    canActivate: [authguardGuard],
    children: [
      { path: '', redirectTo: 'member', pathMatch: 'full' },
      { path: 'member', component: MemberManagementComponent },
      { path: 'country', component: CountryComponent },
      { path: 'fileDownloadReport', component: ReleaseFileDownloadCountComponent },
      { path: 'blocklist', component: BlocklistDomainComponent }
      
    ]
  },
  {
    path: 'landing/:memberKey',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'requestPasswordReset', component: RequestPasswordResetComponent },
      { path: 'resetPassword', component: ResetPasswordComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }