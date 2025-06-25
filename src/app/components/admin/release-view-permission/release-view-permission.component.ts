import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ViewReleaseAccessUserComponent } from '../view-release-access-user/view-release-access-user.component';

@Component({
    selector: 'app-release-view-permission',
    imports: [CommonModule, RouterLink],
    templateUrl: './release-view-permission.component.html',
    styleUrl: './release-view-permission.component.scss'
})
export class ReleaseViewPermissionComponent {

  releasePermissions: any[] = []; 
  masterReleasePermissions: any[] = []; 
  releasePermissionType: string = 'ADMIN_ONLY'; 
  

  constructor(private packagesService: PackagesService, private memberService: MemberService,
      private modalService: NgbModal,
  ) { }



  ngOnInit() {

    this.getReleasePermission();
    this.getMasterReleasePermission();

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


  removePermission(releasePermission: any){
    if(releasePermission.releasePackageId){
      this.packagesService.releaseAccessRevoke(releasePermission.releasePackageId, releasePermission.permissionType).subscribe({
        next: (data: any[]) => {
          this.getReleasePermission();
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }

    else{
      this.packagesService.releaseAccessRevoke(releasePermission.releaseType, releasePermission.releasePermissionType).subscribe({
        next: (data: any[]) => {
          this.getMasterReleasePermission();
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }

  }

   get sortedReleaseNames() {
    return this.releasePermissions.sort((a, b) => a.name.localeCompare(b.name));
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
