import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
    selector: 'app-delete-release-package',
    imports: [CommonModule, NgbAlert, ModalComponent],
    templateUrl: './delete-release-package.component.html',
    styleUrl: './delete-release-package.component.scss'
})
export class DeleteReleasePackageComponent {
  @Input() releasePackage: any;
  alerts: any[] = [];
  submitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private packagesService: PackagesService
  ) { }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(): void {
    this.submitting = true;
    this.alerts = []; 

    this.packagesService.delete(this.releasePackage).subscribe({
      next: (result) => {
        this.activeModal.close(result);
      },
      error: (error) => {
        console.error('Network request failure [27]:', error);
        this.alerts.push({ type: 'danger', msg: 'Network request failure [27]: please try again later.' });
        this.submitting = false;
      }
    });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1); 
  }
}