import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-edit-count-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CompareTextPipe,ModalComponent],
  templateUrl: './edit-count-modal.component.html',
  styleUrl: './edit-count-modal.component.scss'
})
export class EditCountModalComponent implements OnInit {
  formCount: FormGroup;
  submitAttempted = false;
  submitting = false;
  alerts: { type: string; msg: string }[] = [];
  @Input() country: any;
  count: any;
  usageReport: any;
constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private commercialUsageService: CommercialUsageService
  ) {
    // Initialize formCount with a default empty form group
    this.formCount = this.fb.group({});
  }

  ngOnInit(): void {
    this.formCount = this.fb.group({
      commercialUsageCountId: [this.count?.commercialUsageCountId || '', Validators.required], // Add this control
      country: [this.country],
      snomedPractices: [this.count?.snomedPractices || 0, [Validators.required, Validators.min(0)]],
      notes: [this.count?.notes || ''],
      hospitalsStaffingPractices: [this.count.hospitalsStaffingPractices],
      dataCreationPracticesNotPartOfHospital: [this.count.dataCreationPracticesNotPartOfHospital],
      nonPracticeDataCreationSystems: [this.count.nonPracticeDataCreationSystems],
      deployedDataAnalysisSystems: [this.count.deployedDataAnalysisSystems],
      databasesPerDeployment: [this.count.databasesPerDeployment],
    });
  }


  cancel(): void {
    this.activeModal.dismiss();
  }

  updateCount(): void {
    this.submitAttempted = true;

    if (this.formCount.invalid) {
      return;
    }

    this.submitting = true;
    this.alerts = [];

    this.commercialUsageService.updateUsageCount(this.usageReport, this.formCount.value)
      .subscribe({
        next: (result) => {
          this.activeModal.close(result);
        },
        error: () => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [16]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}