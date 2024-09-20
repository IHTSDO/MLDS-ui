import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditReleaseLicenseConfirmModalComponent } from '../edit-release-license-confirm-modal/edit-release-license-confirm-modal.component';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-release-package-license-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './release-package-license-modal.component.html',
  styleUrl: './release-package-license-modal.component.scss'
})
export class ReleasePackageLicenseModalComponent {
  @Input() releasePackage:any;
  alerts: { type: string, msg: string }[] = [];
  submitStatus = {
    submitting: false,
    submitSuccessful: false
  };
  licenseForm = {
    file: null as File | null
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private releasePackageService: ReleasePackageService
  ) {}

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.licenseForm.file = input.files[0];
    }
  }

  submit(): void {
    if(this.licenseForm.file){
      this.confirmUpload();
    }
    else{
      this.alerts = [];
      this.alerts.push({ type: 'danger', msg: 'No file selected.' });
      this.submitStatus.submitting = false;
    }
  }


  private confirmUpload(): void {
    const modalRef = this.modalService.open(EditReleaseLicenseConfirmModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.result.then(() => {
      console.log("confirmed");
      this.updateReleasePackageLicense();
    });
  }

  private updateReleasePackageLicense(): void {
    this.alerts = [];
    this.submitStatus.submitting = true;

    if (this.licenseForm.file) {
      this.releasePackageService.updateReleaseLicense(this.releasePackage.releasePackageId, this.licenseForm.file)
        .subscribe({
          next: () => {
            this.alerts.push({ type: 'success', msg: 'New license has been uploaded.' });
            this.submitStatus.submitSuccessful = true;
            this.submitStatus.submitting = false;
          },
          error: (error) => {
            console.error(error);
            this.alerts.push({ type: 'danger', msg: `Network request failure: please try again later. [${error.message}]` });
            this.submitStatus.submitting = false;
          }
        });
    } else {
      this.alerts.push({ type: 'danger', msg: 'No file selected.' });
      this.submitStatus.submitting = false;
    }
  }

}
