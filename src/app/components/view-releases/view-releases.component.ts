import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import _ from 'lodash';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberPckageService } from 'src/app/services/member-package/member-pckage.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { SortLimitPipe } from "../../pipes/sort-limit/sort-limit.pipe";

@Component({
  selector: 'app-view-releases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SortLimitPipe],
  templateUrl: './view-releases.component.html',
  styleUrl: './view-releases.component.scss'
})
export class ViewReleasesComponent implements OnInit {
  releasePackagesByMember: { member: any, packages: any[] }[] = [];
  public releasePackage: any;
  alphaReleasePackagesByMember: { member: any, packages: any[] }[] = [];
  standingState!: string;
  primaryApplication: any[] = [];
  applications: any;
  matchingExtensionApplication: any;
  isPendingInvoice: boolean = false;
  isAccountDeactivated: boolean = false;
  isPrimaryApplicationWaitingForApplicant: boolean = false;
  isPrimaryApplicationApproved: boolean = false;
  sessionMember = this.sessionService.getUserDetails()?.member;
  private openAccordions: Set<number> = new Set();

 


  constructor(
    public sessionService: AuthenticationSharedService,
    private packageUtilsService: PackageUtilsService,
    private packagesService: PackagesService,
    private memberService: MemberService,
    public userAffiliateService: UserAffiliateService,
    private affiliateService: AffiliateService,
    private standingStateUtils: StandingStateUtilsService,
    private applicationUtilsService: ApplicationUtilsService,
    public memberPackageService: MemberPckageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReleasePackages();
    this.loadAffiliateState();
    this.loadUserState();
  }


  private loadUserState(): void {
    this.userAffiliateService.loadUserAffiliate();
  }

  private loadReleasePackages(): void {
    this.packagesService.loadPackages().subscribe({
      next: (data) => {
        this.releasePackage = data;
        this.updateReleasePackagesByMember(this.releasePackage);
        this.updateAlphaReleasePackagesByMember(this.releasePackage);
      }
    });
  }

  private loadAffiliateState(): void {
    this.affiliateService.myAffiliate().subscribe({
      next: (data) => {
        this.standingState = data[0].standingState;
        this.primaryApplication = data[0].application;
        this.applications = data[0].applications;
        this.loadStandingState();
      }
    });
  }


  updateReleasePackagesByMember(releasePackages: any[]): void {
    const publishedPackages = _.filter(releasePackages, this.packageUtilsService.isPackagePublished);
    const groupedByMember = _.groupBy(publishedPackages, (p) => p.member.key);

    this.releasePackagesByMember = _.map(groupedByMember, (packages, memberKey) => ({
      member: this.memberService.membersByKey[memberKey],
      packages: this.packageUtilsService.releasePackageSort(packages)
    }));

    const sessionMember = this.sessionMember;
    if (sessionMember != null) {
      const memberRelease = _.find(this.releasePackagesByMember, (item) => {
        return sessionMember['key'] != null && sessionMember['key'] !== 'undefined' && sessionMember['key'] !== "IHTSDO" &&
               item.member.key === sessionMember['key'];
      });

      if (memberRelease) {
        _.each(this.releasePackagesByMember, (item) => {
          if (item.member.key === "IHTSDO" && memberRelease) {
            _.each(memberRelease.packages, (releasePackage) => {
              item.packages.push(releasePackage);
            });
            item.packages = this.packageUtilsService.releasePackageSort(item.packages);
          }
        });
      }
    }
  }

  updateAlphaReleasePackagesByMember(releasePackages: any[]): void {
   
    const filteredPackages = _.reject(releasePackages, this.packageUtilsService.isPackageOffline);
    const nonPublishedPackages = _.reject(filteredPackages, this.packageUtilsService.isPackagePublished);

    const groupedByMember = _.groupBy(nonPublishedPackages, (p) => p.member.key);

    this.alphaReleasePackagesByMember = _.map(groupedByMember, (packages, memberKey) => ({
      member: this.memberService.membersByKey[memberKey],
      packages: this.packageUtilsService.releasePackageSort(packages)
    }));

    const sessionMember = this.sessionMember;
    if (sessionMember != null) {
      const alphaMemberRelease = _.find(this.alphaReleasePackagesByMember, (item) => {
        return sessionMember['key'] != null && sessionMember['key'] !== 'undefined' && sessionMember['key'] !== "IHTSDO" &&
               item.member.key === sessionMember['key'];
      });

      if (alphaMemberRelease) {
        _.each(this.alphaReleasePackagesByMember, (item) => {
          if (item.member.key === "IHTSDO" && alphaMemberRelease) {
            _.each(alphaMemberRelease.packages, (releasePackage) => {
              item.packages.push(releasePackage);
            });
            item.packages = this.packageUtilsService.releasePackageSort(item.packages);
          }
        });
      }
    }
  }

  private loadStandingState(): void {
     this.isPendingInvoice = this.standingStateUtils.isPendingInvoice(this.standingState);
     this.isAccountDeactivated = this.standingStateUtils.isDeactivated(this.standingState);
     this.isPrimaryApplicationWaitingForApplicant = this.applicationUtilsService.isApplicationWaitingForApplicant(this.primaryApplication);
     this.isPrimaryApplicationApproved = this.applicationUtilsService.isApplicationApproved(this.primaryApplication);
  }
  
  viewLicense(memberKey: string): void {
    this.memberService.getMemberLicense(memberKey).subscribe();
  }

  goToViewPackagePage(releasePackageId: string): void {
    this.router.navigate(['/viewReleases/viewRelease', releasePackageId]);
  }

  isIHTSDOPackage(member: any): boolean {
    return this.memberService.isIhtsdoMember(member);
  }

  isMembershipUnstarted(member: any): boolean {
    return this.userAffiliateService.isMembershipNotStarted(member);
  }

  isMembershipIncomplete(member: any): boolean {
    return this.userAffiliateService.isMembershipIncomplete(member);
  }

  isApplicationWaitingForApplicant(member: any): boolean {
    return this.applicationUtilsService.isApplicationWaitingForApplicant(this.implementExtension(member));
  }
  
  implementExtension(member:any){
    this.matchingExtensionApplication = this.getLatestMatchingMemberApplication(member);
    return this.matchingExtensionApplication;
  }

  getLatestMatchingMemberApplication(member:any){
    const filterApplications = this.applications
      .filter((application: any) => application.member.key === member.member.key);

    return filterApplications.reduce((latest: any, application: any) => 
      new Date(application.submittedAt) > new Date(latest.submittedAt) ? application : latest, 
    filterApplications[0]
    );
  }


  
  toggleAccordion(index: number): void {
    if (this.openAccordions.has(index)) {
      this.openAccordions.delete(index);
    } else {
      this.openAccordions.add(index);
    }
  }

  isAccordionOpen(index: number): boolean {
    return this.openAccordions.has(index);
  }
}