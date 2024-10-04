import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { chain } from 'lodash';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { FilterOnlinePipe } from "../../../pipes/filter-online/filter-online.pipe";
import { FilterAlphabetaPipe } from 'src/app/pipes/filter-alphabeta/filter-alphabeta.pipe';
import { FilterOfflinePipe } from "../../../pipes/filter-offline/filter-offline.pipe";
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { IhtsdoReleasesModalComponent } from "../../common/ihtsdo-releases-modal/ihtsdo-releases-modal.component";


@Component({
  selector: 'app-ihtsdo-releases',
  standalone: true,
  imports: [CommonModule, FilterOnlinePipe, FilterAlphabetaPipe, FilterOfflinePipe, EnumPipe, CompareTextPipe, TranslateModule, IhtsdoReleasesModalComponent],
  templateUrl: './ihtsdo-releases.component.html',
  styleUrl: './ihtsdo-releases.component.scss'
})
export class IhtsdoReleasesComponent implements OnInit {
  utils = this.packageUtilsService;
  member = this.memberService.ihtsdoMember;
  onlinePackages: any[] = [];
  offlinePackages: any[] = [];
  alphabetaPackages: any[] = [];
  releasePackage: any[] = [];
  isLoading: boolean = true;

  constructor(
    private packageUtilsService: PackageUtilsService,
    private router: Router,
    private memberService: MemberService,
    private packagesService: PackagesService,
  ) { }

  ngOnInit(): void {
    this.loadReleasePackages();
  }

  private loadReleasePackages(): void {
    this.packagesService.loadPackages().subscribe({
      next: (data) => {
        this.releasePackage = data;
        this.initializePackages();
      }
    });
  }

  viewLicense(): void {
    this.memberService.getMemberLicense(this.memberService.ihtsdoMemberKey);
  }

  goToPackage(releasePackage: any): void {
    this.router.navigate(['/ihtsdoReleases/ihtsdoRelease', encodeURIComponent(releasePackage.releasePackageId)]);
  }

  getOnlineVersions(versions: any[]): any[] {
    return versions.filter(version => this.packageUtilsService.isVersionOnline(version));
  }

  private initializePackages(): void {
    const releasePackagesQueryResult: any[] = this.releasePackage;

    this.onlinePackages = this.packageUtilsService.releasePackageSort(
      chain(releasePackagesQueryResult)
        .filter(p => this.memberService.isIhtsdoMember(p.member))
        .filter(p => this.packageUtilsService.isPackagePublished(p))
        .value()
    );

    this.offlinePackages = chain(releasePackagesQueryResult)
      .filter(p => this.memberService.isIhtsdoMember(p.member))
      .reject(p => this.packageUtilsService.isPackagePublished(p))
      .reject(p => this.packageUtilsService.isPackageNotPublished(p))
      .reject(p => this.packageUtilsService.isPackageFullyArchived(p))
      .sortBy('createdAt')
      .value();

    this.alphabetaPackages = chain(releasePackagesQueryResult)
      .filter(p => this.memberService.isIhtsdoMember(p.member))
      .reject(p => this.packageUtilsService.isPackagePublished(p))
      .reject(p => this.packageUtilsService.isPackageOffline(p))
      .reject(p => this.packageUtilsService.isPackageEmpty(p))
      .sortBy('createdAt')
      .value();

    this.isLoading = false;
  }

  isLatestVersion(version: any, versions: any[]): boolean {
    return this.packageUtilsService.isLatestVersion(version, versions);
  }

  filterVersions(releaseVersion: any): any {
    this.packageUtilsService.isVersionOnline(releaseVersion);
  }

}