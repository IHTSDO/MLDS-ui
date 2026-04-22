import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/common/landing-page/landing-page.component';
import { DashboardComponent } from './components/common/dashboard/dashboard.component';
import { authguardGuard } from './auth/authguard.guard';
import { adminGuard } from './auth/admin.guard';
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
import { ReleaseManagementConfigComponent } from './components/admin/release-management-config/release-management-config.component';
import { ReleaseViewPermissionComponent } from './components/admin/release-view-permission/release-view-permission.component';
import { staffAdminGuard } from './auth/staff-admin.guard';
import { memberStaffAdminGuard } from './auth/member-staff-admin.guard';
import { noAuthGuard } from './auth/no-auth.guard';
import { userGuard } from './auth/user.guard';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }, {
    path: 'logout',
    component: LogoutComponent,
  },

  {
    path: 'landing',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent, canActivate: [noAuthGuard] },

    ]
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authguardGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'memberManagement', component: MemberManagementComponent, canActivate: [staffAdminGuard] },
      { path: 'memberManagement/:memberKey/branding', component: ShowMemberBrandingComponent, canActivate: [staffAdminGuard] },
      { path: 'country', component: CountryComponent, canActivate: [adminGuard] },
      { path: 'fileDownloadReport', component: ReleaseFileDownloadCountComponent, canActivate: [adminGuard] },
      { path: 'blocklist', component: BlocklistDomainComponent, canActivate: [adminGuard] },
      { path: 'usageReportsReview', component: UsageReportsComponent, canActivate: [adminGuard] },
      { path: 'metrics', component: MetricsComponent, canActivate: [adminGuard] },
      { path: 'pendingApplications', component: PendingApplicationsComponent, canActivate: [staffAdminGuard] },
      { path: 'affiliateManagement', component: AffiliateManagementComponent, canActivate: [staffAdminGuard] },
      { path: 'applicationReview/:applicationId', component: ApplicationReviewComponent, canActivate: [staffAdminGuard] },
      { path: 'activityLog', component: ActivityLogsComponent, canActivate: [adminGuard] },
      { path: 'logs', component: SystemsLoggersComponent, canActivate: [adminGuard] },
      { path: 'affiliateManagement/:affiliateId', component: AffiliateSummaryComponent, canActivate: [staffAdminGuard] },
      { path: 'reviewUsageReports', component: ReviewUsageReportsComponent, canActivate: [staffAdminGuard] },
      { path: 'usageReportsReview/:commercialUsageId', component: ReviewUsageReportAdminComponent, canActivate: [staffAdminGuard] },
      { path: 'affiliateManagement/:affiliateId/edit', component: EditAffiliateComponent, canActivate: [staffAdminGuard] },
      { path: 'importAffiliates', component: ImportAffiliatesComponent, canActivate: [adminGuard] },
      { path: 'releaseManagement', component: ReleaseManagementComponent, canActivate: [staffAdminGuard] },
      { path: 'releaseManagement/release/:packageId', component: ReleaseComponent, canActivate: [staffAdminGuard] },
      { path: 'releaseConfig', component: ReleaseManagementConfigComponent, canActivate: [adminGuard] },
      { path: 'releaseConfig/viewPermissions', component: ReleaseViewPermissionComponent, canActivate: [adminGuard] },
      { path: 'archiveReleases', component: ArchiveManagementComponent, canActivate: [staffAdminGuard] },
      { path: 'archiveReleases/archivePackage/:packageId', component: ArchiveVersionsComponent, canActivate: [staffAdminGuard] },
      { path: 'ihtsdoReleases', component: IhtsdoReleasesComponent, canActivate: [memberStaffAdminGuard] },
      { path: 'ihtsdoReleases/ihtsdoRelease/:releasePackageId', component: IhtsdoReleaseComponent, canActivate: [memberStaffAdminGuard] },
      { path: 'postAnnouncement', component: PostAnnouncementComponent, canActivate: [staffAdminGuard] },
      { path: 'usageReports/usageLog/:commercialUsageId', component: FullPageUsageLogComponent, canActivate: [staffAdminGuard] },
    ]
  },
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: '', component: LandingContentComponent },
      { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
      { path: 'requestPasswordReset', component: RequestPasswordResetComponent, canActivate: [noAuthGuard] },
      { path: 'resetPassword', component: ResetPasswordComponent, canActivate: [noAuthGuard] },
      { path: 'userDashboard', component: UserDashboardComponent, canActivate: [userGuard] },
      { path: 'activate', component: ActivateComponent, canActivate: [noAuthGuard] },
      { path: 'viewReleases', component: ViewReleasesComponent },
      { path: 'viewReleases/viewRelease/:releasePackageId', component: ViewReleaseComponent },
      { path: 'emailVerification', component: EmailVerificationComponent, canActivate: [noAuthGuard] },
      { path: 'usageReport', component: UserUsageReportsTableComponent, canActivate: [userGuard] },
      { path: 'password', component: ChangePasswordComponent, canActivate: [userGuard] },
      { path: 'contactInfo', component: ContactInfoComponent, canActivate: [userGuard] },
      { path: 'affiliateRegistration', component: AffiliateRegistrationComponent, canActivate: [userGuard] },
      { path: 'extensionApplication/:applicationId', component: ExtensionApplicationComponent, canActivate: [userGuard] },
      { path: 'usageReport/usageLog/:commercialUsageId', component: FullPageUsageLogComponent, canActivate: [userGuard] },
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