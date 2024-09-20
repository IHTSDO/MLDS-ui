import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from "../../common/modal/modal.component";

@Component({
  selector: 'app-delete-institution-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbAlert, CompareTextPipe, TranslateModule, ModalComponent],
  templateUrl: './delete-institution-modal.component.html',
  styleUrl: './delete-institution-modal.component.scss'
})
export class DeleteInstitutionModalComponent {
  @Input() country!: any;
  @Input() institution!: any;
  @Input() usageReport!: any;
  title = '';
  formGroup!: FormGroup;
  attemptedSubmit = false;
  submitting = false;
  alerts: Array<{ type: string; msg: string }> = [];

  constructor(
    public activeModal: NgbActiveModal,
    private commercialUsageService: CommercialUsageService,
    private translate: TranslateService
  ) {
    this.title = `${this.translate.instant('global.word.delete')} ${this.translate.instant('views.usageLog.institutions.hospAndInst')}`;
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  removeInstitution(): void {
    this.submitting = true;
    this.alerts = []; // Clear previous alerts

    this.commercialUsageService.deleteUsageEntry(this.usageReport, this.institution).subscribe({
      next: (result) => {
        this.activeModal.close(result);
      },
      error: () => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure: please try again later.' });
        this.submitting = false;
      }
    });
  }
}