import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../common/modal/modal.component';
import { CommonModule } from '@angular/common';
import { PackagesService } from 'src/app/services/packages-service/packages.service';

@Component({
    selector: 'app-view-release-access-user',
    imports: [ModalComponent, CommonModule],
    templateUrl: './view-release-access-user.component.html',
    styleUrl: './view-release-access-user.component.scss'
})
export class ViewReleaseAccessUserComponent {

  @Input() users: string[] = [];
  @Input() id: string = '';
  masterConfigIds = ['ONLINE', 'ALPHA/BETA', 'OFFLINE', 'ALL'];
  submitText = '';

  constructor(
      public activeModal: NgbActiveModal, private cdr: ChangeDetectorRef, private packagesService: PackagesService
    ) {}

  
    ngAfterViewInit(): void {
      this.cdr.detectChanges();  
    }

    removeUser(user: any): void{
      this.packagesService.updateUserAccess(this.id, user).subscribe({
        next: (data: any[]) => {
          if(this.masterConfigIds.includes(this.id)){
          this.getMasterUserAccess(this.id);
          }
          else{
            this.getUserAccess(this.id);
          }
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }

    getMasterUserAccess(id: string) {
      this.packagesService.getMasterPermissionedUser(id).subscribe({
        next: (data: any[]) => {
            this.users = data;
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }

    getUserAccess(id: string) {
      this.packagesService.getPermissionedUser(id).subscribe({
        next: (data: any[]) => {
            this.users = data;
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }

    sortUsersByLogin(users: any[]): any[] {
    return users.sort((a, b) => a.localeCompare(b)); 
    }
}
