import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { UsageReportsTableComponent } from '../usage-reports-table/usage-reports-table.component';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { MemberService } from 'src/app/services/member/member.service';
import _ from 'lodash';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { ApplicationSummaryModalComponent } from '../application-summary-modal/application-summary-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, UsageReportsTableComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})

export class UserDashboardComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  affiliate: any = null;
  usageReportsUtils: any;
  standingStateUtils: any;
  anySubmittedUsageReports: boolean = false;
  isRejected: boolean = false;
  isDeactivated: boolean = false;
  isPendingInvoice: boolean = false;
  isDeactivationPending: boolean = false;
  releasePackage: any;
  approvedReleasePackagesByMember: any[] = [];
  notApprovedReleasePackagesByMember: any[] = [];

  constructor(
    private authenticationService: AuthenticationSharedService,
    private affiliateService: AffiliateService,
    private usageReportsService: UsageReportsService,
    private standingStateUtilsService: StandingStateUtilsService,
    private applicationUtilsService: ApplicationUtilsService,
    private packageUtilsService: PackageUtilsService,
    private packagesService: PackagesService,
    private memberService: MemberService,
    private userAffiliateService: UserAffiliateService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const userDetails = this.authenticationService.getUserDetails();
    this.firstName = userDetails?.firstName ?? '';
    this.lastName = userDetails?.lastName ?? '';
    this.loadAffiliate();
  }


  private loadAffiliate(): void {
    this.affiliateService.myAffiliate().subscribe({
      next: (data) => {
        this.affiliate = data[0];
        this.usageReportsUtils = this.usageReportsService;
        this.standingStateUtils = this.standingStateUtilsService;
        this.anySubmittedUsageReports = this.usageReportsService.anySubmittedUsageReports(this.affiliate);
        this.isRejected = this.standingStateUtils.isRejected(this.affiliate.standingState);
        this.isDeactivated = this.standingStateUtils.isDeactivated(this.affiliate.standingState);
        this.isPendingInvoice = this.standingStateUtils.isPendingInvoice(this.affiliate.standingState);
        this.isDeactivationPending = this.standingStateUtils.isDeactivationPending(this.affiliate.standingState);
        this.loadReleasePackages();
      }
    });
  }

  getEffectivePackageMemberKey(releasePackage: any): string {
    const packageMemberKey = releasePackage.member.key;
    if (packageMemberKey === 'IHTSDO') {
      return this.affiliate?.application?.member?.key;
    }
    return packageMemberKey;
  }

  private loadReleasePackages(): void {
    this.packagesService.loadPackages().subscribe({
      next: (data) => {
        this.releasePackage = data;
        console.log(this.releasePackage);
        const releasePackagesByMember = _.chain(this.releasePackage)
          .filter(this.packageUtilsService.isPackagePublished)
          .groupBy(this.getEffectivePackageMemberKey.bind(this))
          .map((packages, memberKey) => {
            return {
              member: this.memberService.membersByKey[memberKey],
              packages: this.packageUtilsService.releasePackageSort(packages)
            };
          })
          .value();
        if (this.isDeactivated) {
          this.approvedReleasePackagesByMember = [];
          this.notApprovedReleasePackagesByMember = releasePackagesByMember;
        }
        else {
          this.approvedReleasePackagesByMember = releasePackagesByMember.filter(memberRelease =>
            this.userAffiliateService.isMembershipApproved(memberRelease.member)
          );

          this.notApprovedReleasePackagesByMember = releasePackagesByMember.filter(memberRelease =>
            !this.userAffiliateService.isMembershipApproved(memberRelease.member)
          );
        }
      }
    });
  }

  isApplicationWaitingForApplicant(application: any): boolean {
    return this.applicationUtilsService.isApplicationWaitingForApplicant(application);
  }

  wasApproved(standingState: any): boolean {
    return this.standingStateUtilsService.wasApproved(standingState);
  }

  isSuccessCategory(standingState: any): boolean {
    return this.standingStateUtils.isSuccessCategory(standingState);
  }

  isWarningCategory(standingState: any): boolean {
    return this.standingStateUtils.isWarningCategory(standingState);
  }

  isDangerCategory(standingState: any): boolean {
    return this.standingStateUtils.isDangerCategory(standingState);
  }

  viewApplication(application: any): void {
    const modalRef = this.modalService.open(ApplicationSummaryModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.application = application;
    modalRef.componentInstance.audits = [];
  }

}