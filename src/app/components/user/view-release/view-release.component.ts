import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { ReviewReleaseLicenseModalComponent } from '../review-release-license-modal/review-release-license-modal.component';
import { ReviewReleaseLicenseWithDisclaimerModalComponent } from '../review-release-license-with-disclaimer-modal/review-release-license-with-disclaimer-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { LoaderComponent } from "../../common/loader/loader.component";

@Component({
  selector: 'app-view-release',
  standalone: true,
  imports: [CommonModule, TranslateModule, CompareTextPipe, LoaderComponent],
  templateUrl: './view-release.component.html',
  styleUrl: './view-release.component.scss'
})
export class ViewReleaseComponent implements OnInit {

  packageId: string | null = null;
  releasePackage: any;
  releaseVersions: any = {
    online: [],
    offline: [],
    alphabeta: []
  };
  isAccountDeactivated: boolean = false;
  standingState!: string;
  primaryApplication: any[] = [];
  applications: any;
  member: any;
  isPendingInvoice: boolean = false;
  isPrimaryApplicationWaitingForApplicant: boolean = false;
  isPrimaryApplicationApproved: boolean = false;
  matchingExtensionApplication: any;
  isLoading: boolean = true; // Add this flag

  constructor(private route: ActivatedRoute, private packagesService: PackagesService,
    private router: Router,
    private packageUtilsService: PackageUtilsService,
    public sessionService: AuthenticationSharedService,
    private userAffiliateService: UserAffiliateService,
    private affiliateService: AffiliateService,
    private standingStateUtils: StandingStateUtilsService,
    private applicationUtilsService: ApplicationUtilsService,
    private memberService: MemberService,
    private releaseVersionsService: ReleaseVersionsService,
    private modalService: NgbModal,
    private releasePackageService: ReleasePackageService) { }

  ngOnInit(): void {
    this.loadReleasePackage();
    
  }

  private loadReleasePackage(): void {
    this.route.paramMap.subscribe(params => {
      this.packageId = params.get('releasePackageId');
    });

    if (this.packageId) {
      this.packagesService.getReleasePackageById(this.packageId).subscribe({
        next: (data: any) => {
          this.releasePackage = data;
          this.member = data.member;
          this.updateVersionsLists(this.releasePackage);
          this.loadAffiliateState();
          this.loadUserState();
        },
        error: (error) => {
          this.isLoading = false;
          this.goToViewPackages();
        }
      });
    }

  }

  private updateVersionsLists(releasePackage: any): void {
    this.releaseVersions = this.packageUtilsService.updateVersionsLists(releasePackage);
  
  }

  private loadUserState(): void {
    this.userAffiliateService.loadUserAffiliate();
  }

  private loadAffiliateState(): void {
    this.affiliateService.myAffiliate().subscribe({
      next: (data) => {
        if(data[0]){
        this.standingState = data[0].standingState;
        this.primaryApplication = data[0].application;
        this.applications = data[0].applications;
        this.loadStandingState();
        }
        else{
          this.isLoading = false;
        }
      },
      error: (err) =>{
        this.isLoading = false;
      }
    });
  }

  private loadStandingState(): void {
    this.isPendingInvoice = this.standingStateUtils.isPendingInvoice(this.standingState);
    this.isAccountDeactivated = this.standingStateUtils.isDeactivated(this.standingState);
    this.isPrimaryApplicationWaitingForApplicant = this.applicationUtilsService.isApplicationWaitingForApplicant(this.primaryApplication);
    this.isPrimaryApplicationApproved = this.applicationUtilsService.isApplicationApproved(this.primaryApplication);
    this.isLoading = false;
  }

  isMembershipApproved(): boolean {
    return this.userAffiliateService.isMembershipApproved(this.member);
  }

  isMembershipUnstarted(): boolean {
    return this.userAffiliateService.isMembershipNotStarted(this.member);
  }

  isIHTSDOPackage(): boolean {
    return this.memberService.isIhtsdoMember(this.member);
  }

  isMembershipIncomplete(): boolean {
    return this.userAffiliateService.isMembershipIncomplete(this.member);
  }

  isApplicationWaitingForApplicant(): boolean {
    return this.applicationUtilsService.isApplicationWaitingForApplicant(this.implementExtension(this.member));
  }

  implementExtension(member: any) {
    this.matchingExtensionApplication = this.getLatestMatchingMemberApplication(member);
    return this.matchingExtensionApplication;
  }

  getLatestMatchingMemberApplication(member: any) {
    const filterApplications = this.applications
      .filter((application: any) => application.member.key === member.key);

    return filterApplications.reduce((latest: any, application: any) =>
      new Date(application.submittedAt) > new Date(latest.submittedAt) ? application : latest,
      filterApplications[0]
    );
  }

  isMembershipInGoodStanding(): boolean {
    return this.isMembershipApproved() &&
      !this.isAccountDeactivated &&
      !this.isPendingInvoice;
  }

  downloadReleaseFile(downloadUrl: any) {
    console.log(this.isMembershipInGoodStanding());
    console.log(downloadUrl);
  
    this.releaseVersionsService.checkFilePresence(downloadUrl).subscribe({
      next: (isIhtsdoPresent: boolean) => {
        console.log('Is IHTSDO present:', isIhtsdoPresent);
        this.openReviewModal(isIhtsdoPresent, downloadUrl);
      },
      error: (err) => {
        console.error('Failed to check file presence:', err);
      }
    });
  }
  
  private openReviewModal(isIhtsdoPresent: boolean, downloadUrl: any) {
    const modalRef = this.modalService.open(isIhtsdoPresent 
      ? ReviewReleaseLicenseModalComponent 
      : ReviewReleaseLicenseWithDisclaimerModalComponent, 
      { backdrop: 'static' }
    );

    modalRef.componentInstance.releasePackage = this.releasePackage;
    
    modalRef.result.then(result => {
      if (result === 'download') {
        window.open(downloadUrl, '_blank', 'noopener');
      }
    }).catch(error => {
      console.error('Modal dismissed with error:', error);
    });
  }
  

  viewReleaseLicense(): void {
    this.releasePackageService.getReleaseLicense(this.releasePackage.releasePackageId);
  }

  goToViewPackages(): void {
    this.router.navigate(['/viewReleases']);
  }
}
