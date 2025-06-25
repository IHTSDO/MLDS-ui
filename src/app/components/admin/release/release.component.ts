import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { TakeOfflineModalComponent } from '../take-offline-modal/take-offline-modal.component';
import { TakeOnlineModalComponent } from '../take-online-modal/take-online-modal.component';
import { TakeAlphaBetaModalComponent } from '../take-alpha-beta-modal/take-alpha-beta-modal.component';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { ReleasePackageLicenseModalComponent } from '../release-package-license-modal/release-package-license-modal.component';
import { ReleaseFileService } from 'src/app/services/release-file/release-file.service';
import { EditReleaseFileModalComponent } from '../edit-release-file-modal/edit-release-file-modal.component';
import { AddReleaseFileModalComponent } from '../add-release-file-modal/add-release-file-modal.component';
import { AddEditReleaseVersionModalComponent } from '../add-edit-release-version-modal/add-edit-release-version-modal.component';
import { DeleteVersionDependentModalComponent } from '../delete-version-dependent-modal/delete-version-dependent-modal.component';
import { DeleteVersionModalComponent } from '../delete-version-modal/delete-version-modal.component';
import { EditReleasePackageModalComponent } from '../edit-release-package-modal/edit-release-package-modal.component';
import { DeleteReleasePackageComponent } from '../delete-release-package/delete-release-package.component';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { LinkAddblankPipe } from 'src/app/pipes/link-addblank/link-addblink.pipe';
import { RemoveHtmlPipe } from 'src/app/pipes/remove-html/remove-html.pipe';
import { ViewReleaseAccessUserComponent } from '../view-release-access-user/view-release-access-user.component';


@Component({
    selector: 'app-release',
    imports: [CommonModule, NgbModule, EnumPipe, LinkAddblankPipe, RemoveHtmlPipe],
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
  isAdmin : boolean | undefined;
  isLoading: boolean = true;
  isMasterPermissionPresent: boolean = true;
  viewPermission: string = '';
  releaseType: string = '';

  constructor(private packagesService: PackagesService, private route: ActivatedRoute, private packageUtilsService: PackageUtilsService, private router: Router, private modalService: NgbModal, private releasePackageService: ReleasePackageService,
     private releaseFileService: ReleaseFileService,private sessionService: AuthenticationSharedService) { }

  ngOnInit(): void {
    this.isAdmin=this.sessionService.isAdmin();
    this.loadReleasePackageId();
  }

 loadReleasePackageId(): void {
    this.route.paramMap.subscribe(params => {
      this.packageId = params.get('packageId');
      if (this.packageId) {
        this.getReleasePackage(this.packageId);
        if(this.isAdmin){
          this.packagesService.getReleaseVisiblity(this.packageId).subscribe({
            next: (data: any) => {
              let permissionType = data.permissionType;
              this.isMasterPermissionPresent = data.masterPermission;
              this.releaseType = data.releaseType;
              if(permissionType == "NOT_SELECTED"){
                this.viewPermission = "NOT CONFIGURED"
              }
              if(permissionType == "ADMIN_ONLY"){
                this.viewPermission = "ADMIN"
              }
              if(permissionType == "ADMIN_AND_STAFF"){
                this.viewPermission = "ADMIN, STAFF, MEMBER"
              }
              if(permissionType == "ADMIN_STAFF_AFFILIATES"){
                this.viewPermission = "ADMIN, STAFF, MEMBER, AFFLIATES"
              }
              if(permissionType == "ADMIN_STAFF_SELECTED_USERS"){
                this.viewPermission = "ADMIN, STAFF, MEMBER, SELECTED AFFILIATES"
              }
              if(permissionType == "EVERYONE"){
                this.viewPermission = permissionType;
              }
              
            },
            error: (error) => {
              console.error(error);
            }
          })
        }
      }
    });
  }

  getReleasePackage(id: string): void {
    this.isLoading = true;
    this.packagesService.getReleasePackageById(id).subscribe({
      next: (data) => {
        if (this.packageUtilsService.isReleasePackageInactive(this.packageEntity)) {
          this.goToReleaseManagement();
        }
        this.packageEntity = data;
        this.isEditableReleasePackage = this.packageUtilsService.isEditableReleasePackage(this.packageEntity);
        this.isRemovableReleasePackage = this.packageUtilsService.isRemovableReleasePackage(this.packageEntity);
        this.versions = this.packageUtilsService.updateVersionsLists(this.packageEntity);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching release package:', error);
        this.goToReleaseManagement();
      }
    });
  }


  goToReleaseManagement(): void {
    this.router.navigate(['/releaseManagement']);
  }

  takeOnlineModal(selectedReleaseVersion: any) {
    const modalRef = this.modalService.open(TakeOnlineModalComponent, { backdrop: 'static' });

    modalRef.componentInstance.releasePackage = this.packageEntity;
    modalRef.componentInstance.releaseVersion = selectedReleaseVersion;

    modalRef.result.then((result) => {
      if (result) {
        this.loadReleasePackageId();
      }
    });
  }

  takeOfflineModal(selectedReleaseVersion: any) {
    const modalRef = this.modalService.open(TakeOfflineModalComponent, { backdrop: 'static' });

    modalRef.componentInstance.releasePackage = this.packageEntity;
    modalRef.componentInstance.releaseVersion = selectedReleaseVersion;

    modalRef.result.then((result) => {
      if (result) {
        this.loadReleasePackageId();
      }
    });
  }

  takeAlphaBetaModal(selectedReleaseVersion: any) {
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

  editPackage(releasePackage: any) {
    const modalRef = this.modalService.open(EditReleasePackageModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.releasePackage = { ...releasePackage };
    modalRef.result.then(result => {
      if (result) {
        this.loadReleasePackageId();
      }
    }).catch(error => {
      console.log('Modal dismissed', error);
    });
  }

  addReleaseFile(selectedReleaseVersion: any): void {
    const modalRef = this.modalService.open(AddReleaseFileModalComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.releasePackage = { ...this.packageEntity };
    modalRef.componentInstance.releaseVersion = { ...selectedReleaseVersion };

    modalRef.result.then(() => {
      this.loadReleasePackageId();
    }, (reason) => {
      console.log('Modal dismissed:', reason);
    });
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

  deleteReleaseFile(releaseVersion: any, releaseFile: any): void {
    const releasePackageId = this.packageEntity.releasePackageId;

    this.releaseFileService.delete(releasePackageId, releaseVersion.releaseVersionId, releaseFile.releaseFileId)
      .subscribe({
        next: () => {
          this.loadReleasePackageId();
        },
        error: (error) => {
          console.error('Error deleting release file:', error);
        }
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

  deleteVersionModal(selectedReleaseVersion: any): void {
    this.releasePackageService.determineDependencyPresence(selectedReleaseVersion.releaseVersionId)
      .subscribe({
        next: (isDependencyPresent: boolean) => {
          const modalComponent = isDependencyPresent ? 
                                 DeleteVersionDependentModalComponent : 
                                 DeleteVersionModalComponent;
  
          const modalRef = this.modalService.open(modalComponent, {
            size: 'lg',
            backdrop: 'static',
          });
  
          modalRef.componentInstance.releasePackage = { ...this.packageEntity };
          modalRef.componentInstance.releaseVersion = { ...selectedReleaseVersion };
  
          modalRef.result.then(() => {
            this.loadReleasePackageId();
          }).catch((error) => {
            console.log('Modal dismissed');
          });
        },
        error: (error: any) => {
          console.error('Error checking dependency:', error);
        }
      });
  }

  deleteReleasePackage(releasePackage: any): void {

    const modalRef = this.modalService.open(DeleteReleasePackageComponent, {
      backdrop: 'static'
    });

    modalRef.componentInstance.releasePackage = releasePackage;

    modalRef.result.then(
      (result) => {
        this.goToReleaseManagement();
      },
      (reason) => {
        console.log('Dismissed');
      }
    );
  }


  
  getPermissionedUsers(){
    if(this.packageId){
    if(this.isMasterPermissionPresent){
      this.getMasterUserAccess(this.releaseType)
    }
    else{
      this.getUserAccess(this.packageId)
    }}
  }


   getUserAccess(id: string) {
      this.packagesService.getPermissionedUser(id).subscribe({
        next: (data: any[]) => {
            const modalRef = this.modalService.open(ViewReleaseAccessUserComponent, {
                  size: 'lg',
                  backdrop: 'static'
                });
            modalRef.componentInstance.users = data;
            modalRef.componentInstance.id = id;
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }
  
  
    getMasterUserAccess(id: string) {
      this.packagesService.getMasterPermissionedUser(id.toUpperCase()).subscribe({
        next: (data: any[]) => {
            const modalRef = this.modalService.open(ViewReleaseAccessUserComponent, {
                  size: 'lg',
                  backdrop: 'static'
                });
            modalRef.componentInstance.users = data;
            modalRef.componentInstance.id = id.toUpperCase();
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }



}
