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
import { ShowMemberBrandingComponent } from './components/show-member-branding/show-member-branding.component';
import { UsageReportsComponent } from './components/usage-reports/usage-reports.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { PendingApplicationsComponent } from './components/pending-application/pending-application.component';
import { AffiliateManagementComponent } from './components/affiliate-management/affiliate-management.component';
import { ApplicationReviewComponent } from './components/application-review/application-review.component';
import { ActivityLogsComponent } from './components/activity-logs/activity-logs.component';
import { SystemsLoggersComponent } from './components/systems-loggers/systems-loggers.component';
import { AffiliateSummaryComponent } from './components/affiliate-summary/affiliate-summary.component';
import { ReviewUsageReportsComponent } from './components/review-usage-reports/review-usage-reports.component';



const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'requestPasswordReset', component: RequestPasswordResetComponent },
      { path: 'resetPassword', component: ResetPasswordComponent },
      { path: 'userDashboard', component: UserDashboardComponent }
    ]
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authguardGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'memberManagement', component: MemberManagementComponent },
      { path: 'memberManagement/:memberKey/branding', component: ShowMemberBrandingComponent },
      { path: 'country', component: CountryComponent },
      { path: 'fileDownloadReport', component: ReleaseFileDownloadCountComponent },
      { path: 'blocklist', component: BlocklistDomainComponent } ,
      { path: 'usageReportsReview', component: UsageReportsComponent },
      { path: 'metrics', component: MetricsComponent },
      { path: 'pendingApplications', component: PendingApplicationsComponent },
      { path: 'affiliateManagement', component: AffiliateManagementComponent },
      { path: 'applicationReview/:applicationId', component: ApplicationReviewComponent},
      { path: 'activityLog', component: ActivityLogsComponent},
      { path: 'logs', component: SystemsLoggersComponent},
      { path: 'affiliateManagement/:affiliateId', component: AffiliateSummaryComponent},
      { path: 'reviewUsageReports', component: ReviewUsageReportsComponent}
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
      { path: 'resetPassword', component: ResetPasswordComponent },
      { path: 'userDashboard', component: UserDashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }