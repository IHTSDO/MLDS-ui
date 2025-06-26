import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import lodash from 'lodash';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberPckageService } from 'src/app/services/member-package/member-pckage.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { SortLimitPipe } from "../../../pipes/sort-limit/sort-limit.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { LoaderComponent } from "../../common/loader/loader.component";
import { LinkAddblankPipe } from 'src/app/pipes/link-addblank/link-addblink.pipe';

@Component({
    selector: 'app-view-releases',
    imports: [CommonModule, FormsModule, SortLimitPipe, TranslateModule, CompareTextPipe, LoaderComponent, LinkAddblankPipe],
    templateUrl: './view-releases.component.html',
    styleUrl: './view-releases.component.scss'
})
export class ViewReleasesComponent implements OnInit {
  releasePackagesByMember: { member: any, packages: any[] }[] = [];
  public releasePackage: any;
  alphaReleasePackagesByMember: { member: any, packages: any[] }[] = [];
  offlinePackagesByMember: { member: any, packages: any[] }[] = [];
  standingState!: string;
  primaryApplication: any[] = [];
  applications: any;
  matchingExtensionApplication: any;
  isPendingInvoice: boolean = false;
  isAccountDeactivated: boolean = false;
  isPrimaryApplicationWaitingForApplicant: boolean = false;
  isPrimaryApplicationApproved: boolean = false;
  sessionMember = this.sessionService.getUserDetails()?.member;
  private openAccordions: Set<String> = new Set();
  isLoading: boolean = true; // Add this flag
 


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
    public packageUtilService: PackageUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadReleasePackages();
    if(this.sessionService.isAuthenticated()){
    this.loadAffiliateState();
    this.loadUserState();
    }
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
        this.updateOfflinePackagesByMember(this.releasePackage);
      }
    });
  }

  private loadAffiliateState(): void {
    if(this.sessionService.isAuthenticated()){
    this.affiliateService.myAffiliate().subscribe({
      next: (data) => {
        if(data[0]){
        this.userAffiliateService.setAffiliate(data[0]);
        this.standingState = data[0].standingState;
        this.primaryApplication = data[0].application;
        this.applications = data[0].applications;
        this.loadStandingState();
        }
        else{
          this.isLoading = false;
          console.warn('No affiliate data found');
        }
      },
      error: (err) =>{
        this.isLoading = false;
      }
    });
  }else{
    this.isLoading = false;
  }
  }


  updateReleasePackagesByMember(releasePackages: any[]): void {
    const publishedPackages = lodash.filter(releasePackages, this.packageUtilsService.isPackagePublished);
    const groupedByMember = lodash.groupBy(publishedPackages, (p) => p.member.key);

    this.releasePackagesByMember = lodash.map(groupedByMember, (packages, memberKey) => ({
      member: this.memberService.membersByKey[memberKey],
      packages: this.packageUtilsService.releasePackageSort(packages)
    }));

    const sessionMember = this.sessionMember;
    if (sessionMember != null) {
      const memberRelease = lodash.find(this.releasePackagesByMember, (item) => {
        return sessionMember['key'] != null && sessionMember['key'] !== 'undefined' && sessionMember['key'] !== "IHTSDO" &&
               item.member.key === sessionMember['key'];
      });

      if (memberRelease) {
        lodash.each(this.releasePackagesByMember, (item) => {
            if (item.member.key === "IHTSDO") {
                // Ensure item.packages is initialized
                if (!item.packages) {
                    item.packages = []; // Initialize as an empty array if undefined
                }
    
                // Push each release package from memberRelease.packages into item.packages
                lodash.each(memberRelease.packages, (releasePackage) => {
                    item.packages.push(releasePackage);
                });
    
                // Sort item.packages after pushing the release packages
                item.packages = this.packageUtilsService.releasePackageSort(item.packages);
            }
        });
    }
    
    }
    this.isLoading = false;
    this.scrollToFragment();
  }


   updateOfflinePackagesByMember(releasePackages: any[]): void {
    const filteredPackages = lodash.filter(releasePackages, this.packageUtilsService.isPackageOffline);
    const nonPublishedPackages = lodash.reject(filteredPackages, this.packageUtilsService.isPackagePublished);
    const removeEmptyFiles = lodash.reject(nonPublishedPackages, this.packageUtilService.isPackageEmpty);

    const groupedByMember = lodash.groupBy(removeEmptyFiles, (p) => p.member.key);

    this.offlinePackagesByMember = lodash.map(groupedByMember, (packages, memberKey) => ({
      member: this.memberService.membersByKey[memberKey],
      packages: this.packageUtilsService.releasePackageSort(packages)
    }));

    const sessionMember = this.sessionMember;
    if (sessionMember != null) {
      const offlineMemberRelease = lodash.find(this.offlinePackagesByMember, (item) => {
        return sessionMember['key'] != null && sessionMember['key'] !== 'undefined' && sessionMember['key'] !== "IHTSDO" &&
               item.member.key === sessionMember['key'];
      });

      if (offlineMemberRelease) {
        lodash.each(this.offlinePackagesByMember, (item) => {
            if (item.member.key === "IHTSDO") {           
                if (!item.packages) {
                    item.packages = []; 
                }
    
                lodash.each(offlineMemberRelease.packages, (releasePackage) => {
                    item.packages.push(releasePackage);
                });
    
                item.packages = this.packageUtilsService.releasePackageSort(item.packages);
            }
        });
    }
    
    }

  }

  updateAlphaReleasePackagesByMember(releasePackages: any[]): void {
   
    const filteredPackages = lodash.reject(releasePackages, this.packageUtilsService.isPackageOffline);
    const nonPublishedPackages = lodash.reject(filteredPackages, this.packageUtilsService.isPackagePublished);

    const groupedByMember = lodash.groupBy(nonPublishedPackages, (p) => p.member.key);

    this.alphaReleasePackagesByMember = lodash.map(groupedByMember, (packages, memberKey) => ({
      member: this.memberService.membersByKey[memberKey],
      packages: this.packageUtilsService.releasePackageSort(packages)
    }));

    const sessionMember = this.sessionMember;
    if (sessionMember != null) {
      const alphaMemberRelease = lodash.find(this.alphaReleasePackagesByMember, (item) => {
        return sessionMember['key'] != null && sessionMember['key'] !== 'undefined' && sessionMember['key'] !== "IHTSDO" &&
               item.member.key === sessionMember['key'];
      });

      if (alphaMemberRelease) {
        lodash.each(this.alphaReleasePackagesByMember, (item) => {
            if (item.member.key === "IHTSDO") {
                // Ensure item.packages is initialized
                if (!item.packages) {
                    item.packages = []; // Initialize as an empty array if undefined
                }
    
                // Push each release package from alphaMemberRelease.packages into item.packages
                lodash.each(alphaMemberRelease.packages, (releasePackage) => {
                    item.packages.push(releasePackage);
                });
    
                // Sort item.packages after pushing the release packages
                item.packages = this.packageUtilsService.releasePackageSort(item.packages);
            }
        });
    }
    
    }
    this.isLoading = false;
    this.scrollToFragment();
  }

  private loadStandingState(): void {
     this.isPendingInvoice = this.standingStateUtils.isPendingInvoice(this.standingState);
     this.isAccountDeactivated = this.standingStateUtils.isDeactivated(this.standingState);
     this.isPrimaryApplicationWaitingForApplicant = this.applicationUtilsService.isApplicationWaitingForApplicant(this.primaryApplication);
     this.isPrimaryApplicationApproved = this.applicationUtilsService.isApplicationApproved(this.primaryApplication);
     this.isLoading = false;
    }
  

  viewLicense(memberKey: string) {
    this.memberService.getMemberLicense(memberKey).subscribe((licenseData: string) => {
      window.open(licenseData, '_blank', 'noopener');
    });
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

  goToExtensionApplication(): void {
    this.router.navigate(['/extensionApplication', this.matchingExtensionApplication.applicationId]);
  }

  toggleAccordion(index: number, section: 'online' | 'alphaBeta' | 'offline'): void {
    const key = `${section}-${index}`;  
    if (this.openAccordions.has(key)) {
      this.openAccordions.delete(key);
    } else {
      this.openAccordions.add(key);
    }
  }

  isAccordionOpen(index: number, section: 'online' | 'alphaBeta' | 'offline'): boolean {
    const key = `${section}-${index}`;
    return this.openAccordions.has(key);
  }

  // Sort method for packages by packageName
  sortByPackageName(packages: any[]): any[] {
    return packages.sort((a, b) => a.name.localeCompare(b.name));
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  sortByMemberKey(releasePackagesByMember: any[]): any[] {
    if (releasePackagesByMember.length > 1) {
      const sortedArray = releasePackagesByMember
      .sort((a, b) => a.member.key.localeCompare(b.member.key))
      .filter(item => item.member.key !== 'IHTSDO');
      return sortedArray;
    }
    return releasePackagesByMember;
  }

  scrollToFragment(): void {
    this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.error('Could not find element with id:', fragment);
          }
        }, 100);
      }
    });
  }
}