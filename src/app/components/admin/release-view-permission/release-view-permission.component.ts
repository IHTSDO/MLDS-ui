import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MemberService } from 'src/app/services/member/member.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ViewReleaseAccessUserComponent } from '../view-release-access-user/view-release-access-user.component';
import { ReleasePermissionRemoveAlertModelComponent } from '../release-permission-remove-alert-model/release-permission-remove-alert-model.component';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';

@Component({
    selector: 'app-release-view-permission',
    imports: [CommonModule, RouterLink, NgbModule, FormsModule],
    templateUrl: './release-view-permission.component.html',
    styleUrl: './release-view-permission.component.scss'
})
export class ReleaseViewPermissionComponent {

  releasePermissions: any[] = []; 
  masterReleasePermissions: any[] = []; 
  releasePermissionType: string = 'ADMIN_ONLY'; 
  searchTermEachRelease: string = '';
  message: string = '';
  
  users: any[] = [];
  editingRowId: string | null = null;
  editPermissionType: string = '';
  editingMasterRowId: string | null = null;
  editMasterPermissionType: string = '';
  isSaving: boolean = false;

  constructor(private packagesService: PackagesService, private memberService: MemberService,
      private modalService: NgbModal, private releasePackageService: ReleasePackageService
  ) { }



  ngOnInit() {

    this.getReleasePermission();
    this.getMasterReleasePermission();
    this.getUserList();

  }

  getUserList() {
    this.releasePackageService.getUserList().subscribe({
      next: (data: any[]) => {
        this.users = data
          .sort((a, b) => a.login.localeCompare(b.login))
          .map(item => ({
            login: item.login,
            userId: item.userId,
            selected: false
          }));
      },
      error: (error) => console.error('Error fetching user list:', error)
    });
  }

  getReleasePermission() {
    this.packagesService.getReleasePermission().subscribe({
      next: (data: any[]) => {
          this.releasePermissions = data;
      },
      error: (error) => {
        console.error('Error', error);
      }
  });
  }


  getMasterReleasePermission() {
    this.packagesService.getMasterReleasePermission().subscribe({
      next: (data: any[]) => {
          this.masterReleasePermissions = data;
      },
      error: (error) => {
        console.error('Error', error);
      }
  });
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
    this.packagesService.getMasterPermissionedUser(id).subscribe({
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


  removePermission(releasePermission: any) {

     if (releasePermission.versionName) {
      this.message = `Are you sure you want to remove the permission for the release named: <strong>${releasePermission.packageName} - ${releasePermission.versionName}</strong>?`;
    } else {
      this.message = `Are you sure you want to remove the permission for all releases under the type: <strong>${releasePermission.releaseType} </strong>?`;
    }

    const modalRef = this.modalService.open(ReleasePermissionRemoveAlertModelComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.message = this.message;

    modalRef.result.then((confirmed) => {
      if (confirmed) {
        if (releasePermission.releaseVersionId) {
          this.packagesService.releaseAccessRevoke(releasePermission.releaseVersionId, releasePermission.permissionType).subscribe({
            next: () => this.getReleasePermission(),
            error: (error) => console.error('Error', error)
          });
        } else {
          this.packagesService.releaseAccessRevoke(releasePermission.releaseType, releasePermission.releasePermissionType).subscribe({
            next: () => this.getMasterReleasePermission(),
            error: (error) => console.error('Error', error)
          });
        }
      }
    })

  }

  startEdit(releasePermission: any) {
    this.editingRowId = releasePermission.releaseVersionId;
    this.editPermissionType = releasePermission.permissionType;

    if (this.editPermissionType === 'ADMIN_STAFF_SELECTED_USERS') {
      this.packagesService.getPermissionedUser(releasePermission.releaseVersionId).subscribe({
        next: (mappedLogins: string[]) => {
          this.users = this.users.map(u => ({...u, selected: mappedLogins.includes(u.login)}));
        },
        error: (error) => console.error('Error fetching permissioned users:', error)
      });
    } else {
      this.users.forEach(u => u.selected = false);
    }
  }

  cancelEdit() {
    this.editingRowId = null;
    this.editPermissionType = '';
  }

  openUserSelection() {
    const modalRef = this.modalService.open(ViewReleaseAccessUserComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.editMode = true;
    modalRef.componentInstance.allUsers = [...this.users];

    modalRef.componentInstance.saveUsers.subscribe((updatedUsers: any[]) => {
       this.users = updatedUsers;
    });
  }

  saveEdit(releasePermission: any) {
    this.isSaving = true;
    const selectedUserIds = this.users.filter(u => u.selected).map(u => String(u.userId));
    
    this.packagesService.updateReleasesPackageType([releasePermission.releaseVersionId], this.editPermissionType, selectedUserIds).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.editingRowId = null;
        this.getReleasePermission();
      },
      error: (err) => {
        console.error('Error updating release package:', err);
        this.isSaving = false;
      }
    });
  }

  startMasterEdit(releasePermission: any) {
    this.editingMasterRowId = releasePermission.releaseType;
    this.editMasterPermissionType = releasePermission.releasePermissionType;

    if (this.editMasterPermissionType === 'ADMIN_STAFF_SELECTED_USERS') {
      this.packagesService.getMasterPermissionedUser(releasePermission.releaseType).subscribe({
        next: (mappedLogins: string[]) => {
          this.users = this.users.map(u => ({...u, selected: mappedLogins.includes(u.login)}));
        },
        error: (error) => console.error('Error fetching permissioned users for master:', error)
      });
    } else {
      this.users.forEach(u => u.selected = false);
    }
  }

  cancelMasterEdit() {
    this.editingMasterRowId = null;
    this.editMasterPermissionType = '';
  }

  saveMasterEdit(releasePermission: any) {
    this.isSaving = true;
    const selectedUserIds = this.users.filter(u => u.selected).map(u => String(u.userId));
    
    this.packagesService.updateReleasesPackageMasterType(releasePermission.releaseType, this.editMasterPermissionType, selectedUserIds).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.editingMasterRowId = null;
        this.getMasterReleasePermission();
      },
      error: (err) => {
        console.error('Error updating master release package:', err);
        this.isSaving = false;
      }
    });
  }

  selectedReleaseTypeFilter: string = '';

  get availableReleaseTypes(): string[] {
    const types = this.releasePermissions.map(rp => rp.releaseType).filter(t => !!t);
    return [...new Set(types)];
  }

  get sortedReleaseNames() {
    let filtered = this.releasePermissions;

    if (this.selectedReleaseTypeFilter) {
      filtered = filtered.filter(rp => rp.releaseType === this.selectedReleaseTypeFilter);
    }

    if (this.searchTermEachRelease) {
      const term = this.searchTermEachRelease.toLowerCase();
      filtered = filtered.filter(rp => 
        (rp.packageName && rp.packageName.toLowerCase().includes(term)) ||
        (rp.versionName && rp.versionName.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) =>
      (a.packageName + a.versionName)
        .localeCompare(b.packageName + b.versionName)
    );
  }

  getReleasePermissionText(releasePermissionType: string): string {
    const permissionMap: { [key: string]: string } = {
      'ADMIN_ONLY': 'ADMIN',
      'ADMIN_AND_STAFF': 'ADMIN, STAFF AND MEMBER',
      'ADMIN_STAFF_SELECTED_USERS': 'ADMIN, STAFF, MEMBER AND SELECTED USERS',
      'ADMIN_STAFF_AFFILIATES': 'ADMIN, STAFF, MEMBER AND AFFILIATES',
      'EVERYONE':'EVERYONE'
    };

    return permissionMap[releasePermissionType];
  }


}
