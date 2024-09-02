// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import _ from 'lodash';
// import { Subscription } from 'rxjs';
// import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
// import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
// import { MemberService } from 'src/app/services/member/member.service';
// import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
// import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
// import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';

// @Component({
//   selector: 'app-view-release',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './view-release.component.html',/''
//   styleUrl: './view-release.component.scss'
// })
// export class ViewReleaseComponent implements OnInit, OnDestroy {
//   releasePackageId: number | null = null;
//   releasePackage: any = { releaseVersions: [] };
//   releaseVersions = { online: [], offline: [], alphabeta: [] };
//   isMembershipInGoodStanding = false;
//   isMembershipApproved = false;
//   isMembershipIncomplete = false;
//   isMembershipUnstarted = false;
//   isPrimaryApplicationApproved = false;
//   isIHTSDOPackage = false;
//   isApplicationWaitingForApplicant = false;
//   matchingExtensionApplication: any = {};
//   isAccountDeactivated = false;
//   isPendingInvoice = false;

//   private routeSub: Subscription = new Subscription();

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private http: HttpClient,
//     private standingStateUtils: StandingStateUtilsService,
//     private sessionService: AuthenticationSharedService,
//     private applicationUtilsService: ApplicationUtilsService,
//     private userAffiliateService: UserAffiliateService,
//     private memberService: MemberService,
//     private releasePackageService: ReleasePackageService
//   ) {}

//   ngOnInit(): void {
//     this.routeSub = this.route.params.subscribe(params => {
//       this.releasePackageId = params['releasePackageId'] ? parseInt(params['releasePackageId'], 10) : null;
//       this.loadReleasePackage();
//     });

//     this.userAffiliateService['promise'].then(() => {
//       this.initReleasePackageState(this.releasePackage);
//     });
//   }
//   isAuthenticated = this.sessionService.isLoggedIn();
//   authenticated= this.sessionService.isLoggedIn();
//   ngOnDestroy(): void {
//     this.routeSub.unsubscribe();
//   }

//   viewLicense(memberKey: string): void {
//     this.memberService.getMemberLicense(memberKey);
//   }

//   goToExtensionApplication(): void {
//     this.router.navigate(['/extensionApplication', this.matchingExtensionApplication.applicationId]);
//   }

//   goToViewPackages(): void {
//     this.router.navigate(['/viewReleases']);
//   }

//   viewReleaseLicense(): void {
//     this.releasePackageService.getReleaseLicense(this.releasePackageId);
//   }

//   downloadReleaseFile(downloadUrl: string): void {
//     // const checkUrl = downloadUrl.replace('/download', '/check');
//     // this.http.get(checkUrl, { responseType: 'text' }).subscribe(response => {
//     //   const isIhtsdoPresent = response === 'true';
//     //   const modalTemplateUrl = isIhtsdoPresent
//     //     ? 'views/user/reviewReleaseLicenseModal.html'
//     //     : 'views/user/reviewReleaseLicenseWithDisclaimerModal.html';

//     //   this.servicesUtils.$modal.open({
//     //     templateUrl: modalTemplateUrl,
//     //     size: 'lg',
//     //     scope: this
//     //   }).result.then(() => {
//     //     this.servicesUtils.$window.open(downloadUrl, '_blank');
//     //   });
//     // });
//   }

//   private getLatestMatchingMemberApplication(releasePackage: any): any {
//     return _.chain(this.serAffiliateService.affiliate.applications)
//       .filter(application => application.member.key === releasePackage.member.key)
//       .max(application => new Date(application.submittedAt))
//       .value();
//   }

//   private initReleasePackageState(releasePackage: any): void {
//     this.isAccountDeactivated = this.standingStateUtils.isDeactivated(this.servicesBundle.UserAffiliateService.affiliate.standingState);
//     this.isPendingInvoice = this.standingStateUtils.isPendingInvoice(this.servicesBundle.UserAffiliateService.affiliate.standingState);
//     this.isMembershipApproved = this.userAffiliateService.isMembershipApproved(releasePackage.member);
//     this.isMembershipInGoodStanding = this.isMembershipApproved && !this.isAccountDeactivated && !this.isPendingInvoice;
//     this.isMembershipIncomplete = this.userAffiliateService.isMembershipIncomplete(releasePackage.member);
//     this.isMembershipUnstarted = this.userAffiliateService.isMembershipNotStarted(releasePackage.member);
//     this.isPrimaryApplicationApproved = this.applicationUtilsService.isApplicationApproved(this.servicesBundle.UserAffiliateService.affiliate.application);
//     this.isPrimaryApplicationWaitingForApplicant = this.applicationUtilsService.isApplicationWaitingForApplicant(this.servicesBundle.UserAffiliateService.affiliate.application);
//     this.matchingExtensionApplication = this.getLatestMatchingMemberApplication(releasePackage);
//     this.isApplicationWaitingForApplicant = this.applicationUtilsService.isApplicationWaitingForApplicant(this.matchingExtensionApplication);
//     this.isIHTSDOPackage = this.memberService.isIhtsdoMember(releasePackage.member);
//   }

//   private setReleasePackage(releasePackage: any): void {
//     this.releasePackage = releasePackage;
//     this.initReleasePackageState(releasePackage);
//   }

//   private loadReleasePackage(): void {
//     if (this.releasePackage?.releasePackageId) {
//       this.initReleasePackageState(this.releasePackage);
//     } else if (this.releasePackageId) {
//       this.releasePackageService.get({ releasePackageId: this.releasePackageId }).subscribe(
//         result => this.setReleasePackage(result),
//         () => {
//           this.servicesUtils.$log.log('ReleasePackage not found');
//           this.goToViewPackages();
//         }
//       );
//     } else {
//       this.goToViewPackages();
//     }
//   }
// }