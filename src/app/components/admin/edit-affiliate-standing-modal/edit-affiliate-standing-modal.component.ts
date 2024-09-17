import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

@Component({
  selector: 'app-edit-affiliate-standing-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CompareTextPipe],
  templateUrl: './edit-affiliate-standing-modal.component.html',
  styleUrl: './edit-affiliate-standing-modal.component.scss'
})
export class EditAffiliateStandingModalComponent {
  @Input() affiliate: any;
  submitting = false;
  alerts: Array<{ type: string, msg: string }> = [];

  constructor(public activeModal: NgbActiveModal, private affiliateService: AffiliateService, private router: Router) { }

  ok(formStanding: any): void {
    this.submitting = true;
    this.alerts = [];

    this.affiliateService.updateAffiliate(this.affiliate)
      .subscribe({
        next: (result) => {
          this.activeModal.close(result);
          this.submitting = false;
          this.affiliate = result;
          this.router.navigate(['/affiliateManagement', this.affiliate.affiliateId]);
        },
        error: (message) => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [34]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  affiliateActiveDetails(): any {
    return this.affiliate.affiliateDetails || this.affiliate.application?.affiliateDetails;
  }

}
