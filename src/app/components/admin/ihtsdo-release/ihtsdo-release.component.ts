import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

@Component({
  selector: 'app-ihtsdo-release',
  standalone: true,
  imports: [CommonModule, TranslateModule, CompareTextPipe],
  templateUrl: './ihtsdo-release.component.html',
  styleUrl: './ihtsdo-release.component.scss',
})
export class IhtsdoReleaseComponent implements OnInit {
  releasePackageId: string | null = null;
  releasePackage: any = { releaseVersions: { online: [], alphabeta: [], offline: [] } };
  releaseVersions: any = {
    online: [],
    alphabeta: [],
    offline: []
  };
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packagesService: PackagesService,
    private packageUtilsService: PackageUtilsService,
    private userAffiliateService: UserAffiliateService,
    private applicationUtilsService: ApplicationUtilsService,
    private memberService: MemberService,
    private standingStateUtils: StandingStateUtilsService,
    private releasePackageService: ReleasePackageService,
    // private windowRefService: WindowRefService // Abstracted window operations
  ) {}

  ngOnInit(): void {
    this.releasePackageId = this.route.snapshot.paramMap.get('releasePackageId');
    this.loadReleasePackage();
  }
  viewLicense(memberKey: string) {
    this.memberService.getMemberLicense(memberKey).subscribe((licenseData: string) => {
      window.open(licenseData, '_blank', 'noopener');
    });
  }
  

  private loadReleasePackage(): void {
    if (this.releasePackage?.id) {
      this.initReleasePackageState(this.releasePackage);
    } else if (this.releasePackageId) {
      this.packagesService.getReleasePackageById(this.releasePackageId).subscribe({
        next:(result) => this.setReleasePackage(result),
        error: (error: any) => {
          console.error('ReleasePackage not found', error);
          this.goToViewPackages();
        }
    });
    } else {
      this.goToViewPackages();
    }
  }

  private setReleasePackage(releasePackage: any): void {
    this.releasePackage = releasePackage;
    this.initReleasePackageState(releasePackage);
  }

  private initReleasePackageState(releasePackage: any): void {
    this.releaseVersions = this.packageUtilsService.updateVersionsLists(releasePackage);
    this.isLoading = false;
  }

  goToViewPackages(): void {
    this.router.navigate(['/ihtsdoReleases']);
  }

  viewReleaseLicense(): void {
    if (this.releasePackageId) {
      this.releasePackageService.getReleaseLicense(this.releasePackageId);
    }
  }

  downloadReleaseFile(downloadUrl: string): void {
    window.open(downloadUrl, '_blank', 'noopener');
  }
}