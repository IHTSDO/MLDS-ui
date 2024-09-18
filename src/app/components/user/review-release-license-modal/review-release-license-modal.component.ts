import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';

@Component({
  selector: 'app-review-release-license-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule,CompareTextPipe],
  templateUrl: './review-release-license-modal.component.html',
  styleUrl: './review-release-license-modal.component.scss'
})
export class ReviewReleaseLicenseModalComponent {
  @Input() releasePackage: any;
  isLicenseAccepted: boolean = false;

  constructor(public activeModal: NgbActiveModal,private releasePackageService: ReleasePackageService) {}

  viewReleaseLicense(): void {
    this.releasePackageService.getReleaseLicense(this.releasePackage.releasePackageId);
  }

  onDownload(): void {
    if (this.isLicenseAccepted) {
      this.activeModal.close('download');
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
