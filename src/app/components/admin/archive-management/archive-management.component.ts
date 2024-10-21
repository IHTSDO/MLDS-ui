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
  isLoading:boolean=true;
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
  hasNoArchivePackages(): boolean {
    // Check if all members have no archive packages
    return this.packagesByMember.every(memberEntry => memberEntry.archivePackages.length === 0);
  }

  extractPackages(): void {
    this.isLoading=true;
    this.packagesService.loadPackages().subscribe({
      next: (data) => {
        this.isLoading=false;
        this.packages = data;
        if (!this.packages) {
          return;
        }
  
        // Apply member filtering
        const memberFiltered = this.filterPackagesByMember(this.packages);
  
        // Process packages by member
        this.packagesByMember = this.processPackagesByMember(memberFiltered);
      }
    });
  }
  
  // Helper function to filter packages by member
  filterPackagesByMember(packages: any[]): any[] {
    return this.releaseManagementFilter.showAllMembers
      ? packages
      : packages.filter(p => this.packageUtilsService.isReleasePackageMatchingMember(p));
  }
  
  // Helper function to check if a version is archived
  isArchivedVersion(releasePackage: any): boolean {
    return releasePackage.releaseVersions.some((version: { archive: any }) => version.archive);
  }
  
  // Helper function to group and process packages by member
  processPackagesByMember(memberFiltered: any[]): any[] {
    return lodash.chain(memberFiltered)
      .groupBy('member.key')
      .map((memberPackages, memberKey) => this.createMemberPackageEntry(memberPackages, memberKey))
      .sortBy(memberEntry => this.sortByMemberKey(memberEntry))
      .value();
  }
  
  // Helper function to create the member package entry
  createMemberPackageEntry(memberPackages: any[], memberKey: string): any {
    const archivePackages = memberPackages.filter(releasePackage => this.isArchivedVersion(releasePackage));
    return {
      member: this.memberService.membersByKey[memberKey],
      archivePackages: archivePackages
    };
  }
  
  // Helper function to sort by member key
  sortByMemberKey(memberEntry: any): string {
    return memberEntry.member.key === 'IHTSDO' ? '!IHTSDO' : memberEntry.member.key;
  }
  

  goToArchivePackage(packageEntity: any): void {
    this.router.navigate(['/archiveReleases/archivePackage', encodeURIComponent(packageEntity.releasePackageId)]);
  }
  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}