import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import _ from 'lodash';
import { MemberService } from 'src/app/services/member/member.service';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { FilterOnlinePipe } from "../../../pipes/filter-online/filter-online.pipe";
import { FormsModule } from '@angular/forms';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddReleaseModalComponent } from '../add-release-modal/add-release-modal.component';

@Component({
  selector: 'app-release-management',
  standalone: true,
  imports: [CommonModule, FilterOnlinePipe, FormsModule, NgbModule],
  templateUrl: './release-management.component.html',
  styleUrl: './release-management.component.scss'
})
export class ReleaseManagementComponent {

  public packagesByMember: any[] = [];
  public isAdmin: boolean = false;
  public alerts: any[] = [];
  public releaseManagementFilter = {
    showAllMembers: ''
  };



  constructor(private packagesService: PackagesService,
    private packageUtilsService: PackageUtilsService,
    private memberService: MemberService,
    private authenticationService: AuthenticationSharedService,
    private router: Router,
    private modalService: NgbModal 
  ) { }

  ngOnInit() {
    this.loadReleasePackages();
    if (this.authenticationService.isLoggedIn()) {
      this.isAdmin = this.authenticationService.isAdmin();
    }
  }

  onShowAllMembersChange(): void {
    this.loadReleasePackages();
  }

  private loadReleasePackages(): void {
    this.packagesService.loadPackages().subscribe({
      next: (data) => {

        const memberFiltered = data.filter(p => this.releaseManagementFilter.showAllMembers || this.packageUtilsService.isReleasePackageMatchingMember(p));

        const groupedByMember = _.groupBy(memberFiltered, 'member.key');

        this.packagesByMember = _.map(groupedByMember, (memberPackages, memberKey) => {

          const onlinePackages = this.packageUtilsService.releasePackageSort(
            _.filter(memberPackages, this.packageUtilsService.isPackagePublished)
          );

          const alphabetaPackages = _.chain(memberPackages)
            .reject(this.packageUtilsService.isPackageOffline.bind(this))
            .reject(this.packageUtilsService.isPackagePublished.bind(this))
            .reject(this.packageUtilsService.isPackageEmpty.bind(this))
            .sortBy('createdAt')
            .value();

          const offlinePackages = _.chain(memberPackages)
            .reject(this.packageUtilsService.isPackagePublished.bind(this))
            .reject(this.packageUtilsService.isPackageNotPublished.bind(this))
            .reject(this.packageUtilsService.isPackageFullyArchived.bind(this))
            .sortBy('createdAt')
            .value();

          return {
            member: this.memberService.getMemberByKey(memberKey),
            onlinePackages: onlinePackages,
            alphabetaPackages: alphabetaPackages,
            offlinePackages: offlinePackages
          };
        });

        this.packagesByMember = _.sortBy(this.packagesByMember, (memberEntry) =>
          memberEntry.member.key === 'IHTSDO' ? '!IHTSDO' : memberEntry.member.key
        );


        this.fixReleasePackagesWithoutPriority(memberFiltered);

      },
      error: (err) => {
        console.error('Error occurred while fetching release packages:', err.message);
      }
    });
  }

  private fixReleasePackagesWithoutPriority(memberFiltered: any[]): void {
    const firstMissing = _.chain(memberFiltered)
      .filter(this.packageUtilsService.isPackagePublished.bind(this))
      .sortBy(this.packageUtilsService.getLatestPublishedDate.bind(this))
      .filter(p => p.priority === -1 || p.priority === null)
      .first()
      .value();
    if (firstMissing) {
      this.updatePackagePriority(firstMissing, 0);
    }
  }


  isLatestVersion(version: any, versions: any[]): boolean {
    return this.packageUtilsService.isLatestVersion(version, versions);
  }

  getOnlineVersions(versions: any[]): any[] {
    return versions.filter(version => this.packageUtilsService.isVersionOnline(version));
  }


  // promote packages functions

  canPromotePackage(memberEntry: any, p: any): boolean {
    return this.findHigherPriorityPackage(memberEntry, p) !== null;
  }

  canDemotePackage(memberEntry: any, p: any): boolean {
    return this.findLowerPriorityPackage(memberEntry, p) !== null;
  }

  findHigherPriorityPackage(memberEntry: any, p: any): any {
    const i = memberEntry.onlinePackages.indexOf(p);
    if (i > 0) {
      return memberEntry.onlinePackages[i - 1];
    } else {
      return null;
    }
  }

  findLowerPriorityPackage(memberEntry: any, p: any): any {
    const i = memberEntry.onlinePackages.indexOf(p);
    if (i !== -1 && i < memberEntry.onlinePackages.length - 1) {
      return memberEntry.onlinePackages[i + 1];
    } else {
      return null;
    }
  }

  // pacakage priority update
  private updatePackagePriority(p: any, priority: any): void {
    this.alerts = [];
    p.priority = priority;
    const packageId = p.releasePackageId;

    this.packagesService.updateReleasePackage(packageId, p).subscribe({
      next: (result) => {
        this.loadReleasePackages();
      },
      error: (err) => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [12]: please try again later.' });
      }
    });
  }

  private exchangePackages(p: any, replace: any): void {
    this.updatePackagePriority(p, replace.priority);
  }

  promotePackage(memberEntry: any, p: any): void {
    const higherPriority = this.findHigherPriorityPackage(memberEntry, p);
    this.exchangePackages(p, higherPriority);
  }

  demotePackage(memberEntry: any, p: any): void {
    const lower = this.findLowerPriorityPackage(memberEntry, p);
    this.exchangePackages(lower, p);
  }

  // member pacakge promote
  promoteMemberPackagesChanged(m: any) {
    this.memberService.updateMember(m).subscribe({
      next: (result) => {
        console.log("updated - promote package");
      },
      error: (err) => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [12]: please try again later.' });
      }
    });
  }

  goToPackage(packageEntity: { releasePackageId: string }) {
    this.router.navigate(['/releaseManagement/release', packageEntity.releasePackageId]);
  }

  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }


// add relase package 
  addReleasePackage() {
    const modalRef = this.modalService.open(AddReleaseModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then(result => {
      if (result === 'save') {
        this.loadReleasePackages();
      }
    }).catch(error => {
      console.error('Modal dismissed');
    });
  }

}
