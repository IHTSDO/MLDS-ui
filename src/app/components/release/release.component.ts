import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { TakeOfflineModalComponent } from '../take-offline-modal/take-offline-modal.component';
import { TakeOnlineModalComponent } from '../take-online-modal/take-online-modal.component';
import { TakeAlphaBetaModalComponent } from '../take-alpha-beta-modal/take-alpha-beta-modal.component';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { ReleasePackageLicenseModalComponent } from '../release-package-license-modal/release-package-license-modal.component';


@Component({
  selector: 'app-release',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './release.component.html',
  styleUrl: './release.component.scss'
})
export class ReleaseComponent {

  packageId: string | null = null;
  packageEntity: any = { releaseVersions: [] };
  isEditableReleasePackage: boolean = false;
  isRemovableReleasePackage: boolean = false;
  versions: { [key: string]: any[] } = {
    online: [],
    offline: [],
    alphabeta: [],
    archive: []
  };

  constructor(private packagesService: PackagesService,  private route: ActivatedRoute, private packageUtilsService: PackageUtilsService, private router: Router,private modalService: NgbModal,private releasePackageService: ReleasePackageService) { }

  ngOnInit(): void {
   this.loadReleasePackageId();
  }

  loadReleasePackageId():void{
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
          this.goToReleaseManagement();
        }
        this.packageEntity = data;
        this.isEditableReleasePackage = this.packageUtilsService.isEditableReleasePackage(this.packageEntity);
        this.isRemovableReleasePackage = this.packageUtilsService.isRemovableReleasePackage(this.packageEntity);
        this.versions = this.packageUtilsService.updateVersionsLists(this.packageEntity);
      },
      error: (error) => {
        console.error('Error fetching release package:', error);
        this.goToReleaseManagement();
      }
    });
  }


  goToReleaseManagement(): void {
    this.router.navigate(['/releaseManagement']);
  }

  takeOnlineModal(selectedReleaseVersion: any){
    const modalRef = this.modalService.open(TakeOnlineModalComponent, { backdrop: 'static' });

    modalRef.componentInstance.releasePackage = this.packageEntity;
    modalRef.componentInstance.releaseVersion = selectedReleaseVersion;

    modalRef.result.then((result) => {
      if (result) {
          this.loadReleasePackageId();
      }
    });
  }

  takeOfflineModal(selectedReleaseVersion: any){
    const modalRef = this.modalService.open(TakeOfflineModalComponent, { backdrop: 'static' });

    modalRef.componentInstance.releasePackage = this.packageEntity;
    modalRef.componentInstance.releaseVersion = selectedReleaseVersion;

    modalRef.result.then((result) => {
      if (result) {
          this.loadReleasePackageId();
      }
    });
  }

  takeAlphaBetaModal(selectedReleaseVersion: any){
    const modalRef = this.modalService.open(TakeAlphaBetaModalComponent, { backdrop: 'static' });

    modalRef.componentInstance.releasePackage = this.packageEntity;
    modalRef.componentInstance.releaseVersion = selectedReleaseVersion;

    modalRef.result.then((result) => {
      if (result) {
          this.loadReleasePackageId();
      }
    });
  }

  moveToArchive(selectedReleaseVersion: any): void {
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



}
