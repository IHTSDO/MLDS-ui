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

@Component({
  selector: 'app-archive-versions',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './archive-versions.component.html',
  styleUrl: './archive-versions.component.scss'
})
export class ArchiveVersionsComponent implements OnInit {

  packageId: string | null = null;
  packageEntity: any = { releaseVersions: [] };
  isEditableReleasePackage: boolean = false;
  isRemovableReleasePackage: boolean = false;
  versions: { [key: string]: any[] } = {
    archive: []
  };

  constructor(private packagesService: PackagesService, private route: ActivatedRoute, private packageUtilsService: PackageUtilsService, private router: Router, private modalService: NgbModal, private releasePackageService: ReleasePackageService) { }

  ngOnInit(): void {
    this.loadReleasePackageId();
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
    this.packagesService.getReleasePackageById(id).subscribe({
      next: (data) => {
        if (this.packageUtilsService.isReleasePackageInactive(this.packageEntity)) {
          this.goToArchiveReleases();
        }
        this.packageEntity = data;
        this.isEditableReleasePackage = this.packageUtilsService.isEditableReleasePackage(this.packageEntity);
        this.isRemovableReleasePackage = this.packageUtilsService.isRemovableReleasePackage(this.packageEntity);
        this.versions = this.packageUtilsService.updateVersionsLists(this.packageEntity);
      },
      error: (error) => {
        console.error('Error fetching release package:', error);
        this.goToArchiveReleases();
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

  updateLicense(): void {
    const modalRef = this.modalService.open(ReleasePackageLicenseModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.releasePackage = this.packageEntity;
  }

  editReleaseFile(releaseVersion: any, releaseFile: any): void {
    const modalRef = this.modalService.open(EditReleaseFileModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.releasePackage = { ...this.packageEntity };
    modalRef.componentInstance.releaseVersion = { ...releaseVersion };
    modalRef.componentInstance.releaseFile = { ...releaseFile };

    modalRef.result.then(() => {
      this.loadReleasePackageId();
    }, (reason) => {
      console.log('Modal dismissed:', reason);
    });
  }

  addReleaseVersion(): void {
    this.openReleaseVersionModal();
  }

  private openReleaseVersionModal(releaseVersion: any = {}): void {
    const modalRef = this.modalService.open(AddEditReleaseVersionModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.releasePackage = { ...this.packageEntity };
    modalRef.componentInstance.releaseVersion = { ...releaseVersion };

    modalRef.result.then(() => {
      this.loadReleasePackageId();
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }


  editReleaseVersion(selectedReleaseVersion: any): void {
    this.openReleaseVersionModal(selectedReleaseVersion);
  }


}
