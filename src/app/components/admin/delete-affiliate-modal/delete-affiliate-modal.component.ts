import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
    selector: 'app-delete-affiliate-modal',
    imports: [CommonModule, EnumPipe, TranslateModule, CompareTextPipe, ModalComponent],
    templateUrl: './delete-affiliate-modal.component.html',
    styleUrl: './delete-affiliate-modal.component.scss'
})
export class DeleteAffiliateModalComponent {
  @Input() affiliate: any;
  submitting = false;
  alerts: { type: string; msg: string }[] = [];
  
  constructor(
    public activeModal: NgbActiveModal,
    private affiliateService: AffiliateService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  deleteAffiliate(): void {
    this.submitting = true;
    this.alerts = [];
    
    this.affiliateService.deleteAffiliate(this.affiliate).subscribe({
      next: (result) => {
        this.activeModal.close(result);
      },
      error: () => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [24]: please try again later.' });
        this.submitting = false;
      }
    });
  }

}
