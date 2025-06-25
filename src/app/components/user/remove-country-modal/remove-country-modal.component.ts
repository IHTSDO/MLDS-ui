import { CommonModule } from '@angular/common';
import { Component,Input} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
    selector: 'app-remove-country-modal',
    imports: [CommonModule, ReactiveFormsModule, NgbAlert, TranslateModule, CompareTextPipe, ModalComponent],
    templateUrl: './remove-country-modal.component.html',
    styleUrl: './remove-country-modal.component.scss'
})
export class RemoveCountryModalComponent {
  @Input() count: any;  // Country and related data
  @Input() hospitalsCount: number | undefined;
  @Input() practicesCount: number | undefined;
  @Input() usageReport: any;
  formGroup!: FormGroup;
  alerts: { type: string, msg: string }[] = [];
  submitting: boolean = false;

  constructor(
    private commercialUsageService: CommercialUsageService,
    public activeModal: NgbActiveModal  // Inject NgbActiveModal to control modal
  ) {}

  submit() {
    this.submitting = true;
    this.alerts = [];

    // Call the delete usage count service
    this.commercialUsageService.deleteUsageCount(this.usageReport, this.count)
      .subscribe({next:
        () => {
          // Close the modal on success
          this.activeModal.close('Country removed');
        },
        error:(error) => {
          // Handle error, show alert, and stop submitting state
          this.alerts.push({ type: 'danger', msg: 'Network request failure [38]: please try again later.' });
          this.submitting = false;  // Stop spinner
        }
  });
  }

  closeAlert(index: number) {
    this.alerts.splice(index, 1);
  }

  cancel() {
    // Dismiss the modal on cancel
    this.activeModal.dismiss('cancel');
  }
}