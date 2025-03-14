import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { ReleasePackageLicenseModalComponent } from '../release-package-license-modal/release-package-license-modal.component';
import { CommonModule } from '@angular/common';
import { EditReleaseFileModalComponent } from '../edit-release-file-modal/edit-release-file-modal.component';
import { AddEditReleaseVersionModalComponent } from '../add-edit-release-version-modal/add-edit-release-version-modal.component';
import { EditReleasePackageModalComponent } from '../edit-release-package-modal/edit-release-package-modal.component';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { LinkAddblankPipe } from 'src/app/pipes/link-addblank/link-addblink.pipe';
import { RemoveHtmlPipe } from 'src/app/pipes/remove-html/remove-html.pipe';

@Component({
  selector: 'app-archive-versions',
  standalone: true,
  imports: [CommonModule, NgbModule, EnumPipe, LinkAddblankPipe, RemoveHtmlPipe],
  templateUrl: './archive-versions.component.html',
  styleUrl: './archive-versions.component.scss'
})

export class ArchiveVersionsComponent implements OnInit {

  packageId: string | null = null;
  packageEntity: any = { releaseVersions: [] };
  isEditableReleasePackage: boolean = false;
  isRemovableReleasePackage: boolean = false;
  versions: { [key: string]: any[] } = { archive: [] };
  isAdmin: boolean | undefined;
  isLoading: boolean = true;

  constructor(
    private packagesService: PackagesService, 
    private route: ActivatedRoute, 
    private packageUtilsService: PackageUtilsService, 
    private router: Router, 
    private modalService: NgbModal, 
    private releasePackageService: ReleasePackageService,
    private sessionService: AuthenticationSharedService
  ) { }

  ngOnInit(): void {
    this.loadReleasePackageId();
    this.isAdmin = this.sessionService.isAdmin();
  }

  loadReleasePackageId(): void {
    this.route.paramMap.subscribe(params => {
      this.packageId = params.get('packageId');
      if (this.packageId) {
        this.getReleasePackage(this.packageId);
      }
    });
  }

  getReleasePackage(id: string): void {
    this.isLoading = true;
    this.packagesService.getReleasePackageById(id).subscribe({
      next: (data) => {
        if (this.packageUtilsService.isReleasePackageInactive(this.packageEntity)) {
          this.goToArchiveReleases();
        }
        this.packageEntity = data;
        this.isEditableReleasePackage = this.packageUtilsService.isEditableReleasePackage(this.packageEntity);
        this.isRemovableReleasePackage = this.packageUtilsService.isRemovableReleasePackage(this.packageEntity);
        this.versions = this.packageUtilsService.updateVersionsLists(this.packageEntity);
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  goToArchiveReleases(): void {
    this.router.navigate(['/archiveReleases']);
  }

  moveToRelease(selectedReleaseVersion: any): void {
    const releaseVersionId = selectedReleaseVersion.releaseVersionId;
    const archiveValue = !selectedReleaseVersion.archive;
    this.releasePackageService.updateArchive(releaseVersionId, archiveValue)
      .subscribe(() => this.loadReleasePackageId());
  }

  viewLicense(): void {
    this.releasePackageService.getReleaseLicense(this.packageEntity.releasePackageId);
  }

  // Common method for opening modals
  openModal(modalComponent: any, size: string, backdrop: boolean | 'static', modalData: any): void {
    const modalRef = this.modalService.open(modalComponent, { size: size, backdrop: backdrop });
    Object.assign(modalRef.componentInstance, modalData);
  
    modalRef.result.then(() => {
      this.loadReleasePackageId();
    }).catch((reason) => {
      this.handleAlertDismiss(reason);
    });
  }
  

  // Specific modal opening methods
  updateLicense(): void {
    this.openModal(ReleasePackageLicenseModalComponent, 'lg', 'static', { releasePackage: this.packageEntity });
  }

  editReleaseFile(releaseVersion: any, releaseFile: any): void {
    this.openModal(EditReleaseFileModalComponent, 'lg', 'static', {
      releasePackage: { ...this.packageEntity },
      releaseVersion: { ...releaseVersion },
      releaseFile: { ...releaseFile }
    });
  }

  addReleaseVersion(): void {
    this.openReleaseVersionModal();
  }

  editReleaseVersion(selectedReleaseVersion: any): void {
    this.openReleaseVersionModal(selectedReleaseVersion);
  }

  editPackage(releasePackage: any): void {
    this.openModal(EditReleasePackageModalComponent, 'lg', 'static', { releasePackage: { ...releasePackage } });
  }

  // Handle adding/editing release versions
  private openReleaseVersionModal(releaseVersion: any = {}): void {
    this.openModal(AddEditReleaseVersionModalComponent, 'lg', 'static', {
      releasePackage: { ...this.packageEntity },
      releaseVersion: { ...releaseVersion },
      isArchivePage: true
    });
  }

  // Error handling method
  private handleError(error: any): void {
    this.isLoading = false;
    console.error('Error fetching release package:', error);
    this.goToArchiveReleases();
  }

  // Handle modal dismiss or alert reason
  private handleAlertDismiss(reason: any): void {
    console.log('Modal dismissed:', reason);
  }
}

