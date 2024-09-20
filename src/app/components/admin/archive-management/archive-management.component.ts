import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import lodash from 'lodash';
import { FilterOnlinePipe } from 'src/app/pipes/filter-online/filter-online.pipe';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { SessionStateService } from 'src/app/services/session-state/session-state.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-archive-management',
  standalone: true,
  imports: [CommonModule, FilterOnlinePipe, FormsModule, NgbModule, EnumPipe,TranslateModule],
  templateUrl: './archive-management.component.html',
  styleUrl: './archive-management.component.scss'
})
export class ArchiveManagementComponent implements OnInit {
  isAdmin: boolean;
  releaseManagementFilter: any;
  alerts: any[] = [];
  memberPackages: any[] = [];
  packages: any[] = [];
  packagesByMember: any[] = [];
  archivePackages: any[] = [];
  member:any;
  constructor(
    private router: Router,
    private packageUtilsService: PackageUtilsService,
    public sessionService: AuthenticationSharedService,
    private sessionStateService: SessionStateService,
    private packagesService: PackagesService,
    private memberService: MemberService,
  ) {
    this.isAdmin = this.sessionService.isAdmin();
    this.releaseManagementFilter = this.sessionStateService.sessionState.releaseManagementFilter;
  }

  ngOnInit(): void {
    this.extractPackages();
    this.member=this.sessionService.getUserDetails()?.member?.['key'];
  }
  onShowAllMembersChange(): void {
    this.extractPackages();
  }


  extractPackages(): void {
    this.packagesService.loadPackages().subscribe({
      next: (data) => {
        this.packages = data;

        if (!this.packages) {
          return;
        }

        const memberFiltered = this.releaseManagementFilter.showAllMembers
          ? this.packages
          : this.packages.filter(p => this.packageUtilsService.isReleasePackageMatchingMember(p));

        this.packagesByMember = lodash.chain(memberFiltered)
          .groupBy('member.key')
          .map((memberPackages, memberKey) => {
            const archivePackages = memberPackages.filter(releasePackage =>
              releasePackage.releaseVersions.some((version: { archive: any; }) => version.archive)
            );
            return {
              member: this.memberService.membersByKey[memberKey],
              archivePackages: archivePackages
            };
          })
          .sortBy(memberEntry => memberEntry.member.key === 'IHTSDO'
            ? '!IHTSDO'
            : memberEntry.member.key)
          .value();
        ;
      }
    })
  }


  goToArchivePackage(packageEntity: any): void {
    this.router.navigate(['/archiveReleases/archivePackage', encodeURIComponent(packageEntity.releasePackageId)]);
  }
  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}