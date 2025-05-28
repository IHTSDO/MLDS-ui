import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/common/landing-page/landing-page.component';
import { DashboardComponent } from './components/common/dashboard/dashboard.component';
import { authguardGuard } from './auth/authguard.guard';
import { LandingContentComponent } from './components/common/landing-content/landing-content.component';
import { LoginComponent } from './components/common/login/login.component';
import { MemberManagementComponent } from './components/admin/member-management/member-management.component';
import { CountryComponent } from './components/admin/country/country.component';
import { RegisterComponent } from './components/common/register/register.component';
import { ReleaseFileDownloadCountComponent } from './components/admin/release-file-download-count/release-file-download-count.component';
import { RequestPasswordResetComponent } from './components/common/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './components/common/reset-password/reset-password.component';
import { BlocklistDomainComponent } from './components/admin/blocklist-domain/blocklist-domain.component';
import { ShowMemberBrandingComponent } from './components/admin/show-member-branding/show-member-branding.component';
import { UsageReportsComponent } from './components/admin/usage-reports/usage-reports.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { MetricsComponent } from './components/admin/metrics/metrics.component';
import { PendingApplicationsComponent } from './components/admin/pending-application/pending-application.component';
import { AffiliateManagementComponent } from './components/admin/affiliate-management/affiliate-management.component';
import { ApplicationReviewComponent } from './components/admin/application-review/application-review.component';
import { ActivityLogsComponent } from './components/admin/activity-logs/activity-logs.component';
import { SystemsLoggersComponent } from './components/admin/systems-loggers/systems-loggers.component';
import { AffiliateSummaryComponent } from './components/admin/affiliate-summary/affiliate-summary.component';
import { ReviewUsageReportsComponent } from './components/admin/review-usage-reports/review-usage-reports.component';
import { ReviewUsageReportAdminComponent } from './components/admin/review-usage-report-admin/review-usage-report-admin.component';
import { EditAffiliateComponent } from './components/admin/edit-affiliate/edit-affiliate.component';
import { LogoutComponent } from './components/common/logout/logout.component';
import { ActivateComponent } from './components/user/activate/activate.component';
import { ReleaseManagementComponent } from './components/admin/release-management/release-management.component';
import { ImportAffiliatesComponent } from './components/admin/import-affiliates/import-affiliates.component';
import { ReleaseComponent } from './components/admin/release/release.component';
import { ArchiveManagementComponent } from './components/admin/archive-management/archive-management.component';
import { ArchiveVersionsComponent } from './components/admin/archive-versions/archive-versions.component';
import { ViewReleasesComponent } from './components/user/view-releases/view-releases.component';
import { ViewReleaseComponent } from './components/user/view-release/view-release.component';
import { IhtsdoReleasesComponent } from './components/admin/ihtsdo-releases/ihtsdo-releases.component';
import { IhtsdoReleaseComponent } from './components/admin/ihtsdo-release/ihtsdo-release.component';
import { EmailVerificationComponent } from './components/user/email-verification/email-verification.component';
import { PostAnnouncementComponent } from './components/admin/post-announcement/post-announcement.component';
import { UserUsageReportsTableComponent } from './components/user/user-usage-reports-table/user-usage-reports-table.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { ContactInfoComponent } from './components/common/contact-info/contact-info.component';
import { ExtensionApplicationComponent } from './components/user/extension-application/extension-application.component';
import { FullPageUsageLogComponent } from './components/common/full-page-usage-log/full-page-usage-log.component';
import { AffiliateRegistrationComponent } from './components/user/affiliate-registration/affiliate-registration.component';
import { UserNotificationComponent } from './components/common/user-notification/user-notification.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },{
  path: 'logout',
  component: LogoutComponent,
},
 
  {
    path: 'landing',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
     
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
      { path: 'reviewUsageReports', component: ReviewUsageReportsComponent},
      { path: 'usageReportsReview/:commercialUsageId', component: ReviewUsageReportAdminComponent},
      { path: 'reviewUsageReports', component: ReviewUsageReportsComponent},
      { path: 'affiliateManagement/:affiliateId/edit', component: EditAffiliateComponent},
      { path: 'releaseManagement', component: ReleaseManagementComponent},
      { path: 'importAffiliates', component: ImportAffiliatesComponent},
      { path: 'releaseManagement', component: ReleaseManagementComponent},
      { path: 'releaseManagement/release/:packageId', component: ReleaseComponent},
      { path: 'archiveReleases', component: ArchiveManagementComponent},
      { path: 'archiveReleases/archivePackage/:packageId', component: ArchiveVersionsComponent},
      { path: 'ihtsdoReleases', component: IhtsdoReleasesComponent},
      { path: 'ihtsdoReleases/ihtsdoRelease/:releasePackageId', component: IhtsdoReleaseComponent},
      { path: 'postAnnouncement', component: PostAnnouncementComponent},
      { path: 'usageReports/usageLog/:commercialUsageId', component: FullPageUsageLogComponent },
    ]
  },
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'requestPasswordReset', component: RequestPasswordResetComponent },
      { path: 'resetPassword', component: ResetPasswordComponent },
      { path: 'userDashboard', component: UserDashboardComponent },
      { path: 'activate', component: ActivateComponent },
      { path: 'viewReleases', component: ViewReleasesComponent },
      { path: 'viewReleases/viewRelease/:releasePackageId', component: ViewReleaseComponent },
      { path: 'emailVerification', component: EmailVerificationComponent },
      { path: 'usageReport', component: UserUsageReportsTableComponent },
      { path: 'password', component: ChangePasswordComponent },
      { path: 'contactInfo', component: ContactInfoComponent },
      { path: 'affiliateRegistration',component: AffiliateRegistrationComponent},
      { path: 'extensionApplication/:applicationId', component: ExtensionApplicationComponent },
      { path: 'usageReport/usageLog/:commercialUsageId', component: FullPageUsageLogComponent },
      { path: 'unsubscribenotification/:affiliateId/:key', component: UserNotificationComponent },
      
    ]
  },
{
  path: 'landing/:memberKey',
  component: LandingPageComponent,
  children: [
    { path: '', component: LandingContentComponent },
  ]
}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled',anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }