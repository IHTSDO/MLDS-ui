import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Country } from 'ngx-bs-tel-input/lib/core/models/country.model';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-institution-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbAlert, CompareTextPipe,TranslateModule],
  templateUrl: './delete-institution-modal.component.html',
  styleUrl: './delete-institution-modal.component.scss'
})
export class DeleteInstitutionModalComponent {
  @Input() country!: any;
  @Input() institution!: any;
  @Input() usageReport!: any;

  attemptedSubmit = false;
  submitting = false;
  alerts: Array<{ type: string; msg: string }> = [];

  constructor(
    public activeModal: NgbActiveModal,
    private commercialUsageService: CommercialUsageService
  ) {}

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