import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { MemberService } from 'src/app/services/member/member.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { ApplicationSummaryModalComponent } from '../application-summary-modal/application-summary-modal.component';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
// implements OnInit {
  // loading = true;
  // firstName: string;  // lastName: string;
  // affiliate: any;
  // approvedReleasePackagesByMember: any[] = [];
  // notApprovedReleasePackagesByMember: any[] = [];
  // showingUserDashboardWidgets = true;
  // packageUtils = PackageUtilsService;
  // usageReportsUtils = UsageReportsService;
  // standingStateUtils = StandingStateUtils;

  // constructor(
  //   private router: Router,
  //   private affiliateService: AffiliateService,
  //   private session: AuthenticationSharedService,
  //   private applicationUtilsService: ApplicationUtilsService,
  //   private usageReportsService: UsageReportsService,
  //   private userAffiliateService: UserAffiliateService,
  //   private packageUtilsService: PackageUtilsService,
  //   private memberService: MemberService,
  //   private packagesService: PackagesService,
  //   private standingStateUtils: StandingStateUtils,
  //   private memberPackageService: MemberPackageService
  // ) {
  //   this.firstName = session.firstName;
  //   this.lastName = session.lastName;
  //   this.affiliate = userAffiliateService.affiliate;
  // }

  // ngOnInit(): void {
  //   this.userAffiliateService.promise.then(() => {
  //     this.loading = false;
  //     this.loadReleasePackages();

  //     if (this.applicationUtilsService.isApplicationWaitingForApplicant(this.userAffiliateService.affiliate.application)) {
  //       this.router.navigate(['/affiliateRegistration']);
  //       return;
  //     }
  //   });
  // }

  // viewLicense(memberKey: string): void {
  //   this.memberService.getMemberLicense(memberKey);
  // }

  // isApplicationPending(application: any): boolean {
  //   return this.applicationUtilsService.isApplicationPending(application);
  // }

  // isApplicationWaitingForApplicant(application: any): boolean {
  //   return this.applicationUtilsService.isApplicationWaitingForApplicant(application);
  // }

  // isApplicationApproved(application: any): boolean {
  //   return this.applicationUtilsService.isApplicationApproved(application);
  // }

  // getEffectivePackageMemberKey(releasePackage: any): string {
  //   const packageMemberKey = releasePackage.member.key;
  //   if (packageMemberKey === 'IHTSDO') {
  //     return this.userAffiliateService.affiliate.application.member.key;
  //   }
  //   return packageMemberKey;
  // }

  // loadReleasePackages(): void {
  //   this.packagesService.query().subscribe(
  //     (releasePackages: any[]) => {
  //       const releasePackagesByMember = releasePackages
  //         .filter(this.packageUtilsService.isPackagePublished)
  //         .reduce((acc, releasePackage) => {
  //           const memberKey = this.getEffectivePackageMemberKey(releasePackage);
  //           acc[memberKey] = acc[memberKey] || {
  //             member: this.memberService.membersByKey[memberKey],
  //             packages: []
  //           };
  //           acc[memberKey].packages.push(releasePackage);
  //           return acc;
  //         }, {});

  //       if (this.standingStateUtils.isDeactivated(this.affiliate.standingState)) {
  //         this.approvedReleasePackagesByMember = [];
  //         this.notApprovedReleasePackagesByMember = Object.values(releasePackagesByMember);
  //       } else {
  //         this.approvedReleasePackagesByMember = Object.values(releasePackagesByMember).filter(
  //           (memberRelease: any) => this.userAffiliateService.isMembershipApproved(memberRelease.member)
  //         );
  //         this.notApprovedReleasePackagesByMember = Object.values(releasePackagesByMember).filter(
  //           (memberRelease: any) => !this.userAffiliateService.isMembershipApproved(memberRelease.member)
  //         );
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Failed to load release packages', error);
  //     }
  //   );
  // }

  // orderByApprovalState(application: any): boolean {
  //   return this.applicationUtilsService.isApplicationApproved(application);
  // }

  // orderByApplicationType(application: any): boolean {
  //   return !this.applicationUtilsService.isPrimaryApplication(application);
  // }

  // viewUsageReports(): void {
  //   this.router.navigate(['/usageReports']);
  // }

  // goToViewPackagePage(releasePackageId: string): void {
  //   this.router.navigate([`/viewReleases/viewRelease/${releasePackageId}`]);
  // }

  // viewApplication(application: any): void {
  //   // You will need to implement modal handling for Angular
  //   // Example using Angular Material Dialog
  //   const dialogRef = this.dialog.open(ApplicationSummaryModalComponent, {
  //     width: '600px',
  //     data: { application, audits: [] }
  //   });
  // }
}