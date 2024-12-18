import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-edit-count-data-analysis',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbAlert,TranslateModule,CompareTextPipe,ModalComponent],
  templateUrl: './edit-count-data-analysis.component.html',
  styleUrl: './edit-count-data-analysis.component.scss'
})
export class EditCountDataAnalysisComponent implements OnInit {
  formCount: FormGroup;
  submitAttempted = false;
  submitting = false;
  alerts: { type: string; msg: string }[] = [];
  @Input() country: any;
  count: any;
  usageReport: any;
  hospitalsCount: number | undefined;
  practicesCount: number | undefined;
  title = '';
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private commercialUsageService: CommercialUsageService,
    private translate: TranslateService
  ) {
    this.formCount = this.fb.group({
      commercialUsageCountId: [this.count?.commercialUsageCountId || '', Validators.required], // Add this control
      hospitalsStaffingPractices: [this.count?.hospitalsStaffingPractices || 0, [Validators.required, Validators.min(0)]],
      dataCreationPracticesNotPartOfHospital: [this.count?.dataCreationPracticesNotPartOfHospital || 0, [Validators.required, Validators.min(0)]],
      nonPracticeDataCreationSystems: [this.count?.nonPracticeDataCreationSystems || 0, [Validators.required, Validators.min(0)]],
      deployedDataAnalysisSystems: [this.count?.deployedDataAnalysisSystems || 0, [Validators.required, Validators.min(0)]],
      databasesPerDeployment: [this.count?.databasesPerDeployment || 0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.formCount = this.fb.group({
      commercialUsageCountId: [this.count?.commercialUsageCountId || '', Validators.required], // Add this control
      country: [this.country],
      hospitalsStaffingPractices: [this.count.hospitalsStaffingPractices || 0, [Validators.required, Validators.min(0)]],
      dataCreationPracticesNotPartOfHospital: [this.count.dataCreationPracticesNotPartOfHospital || 0, [Validators.required, Validators.min(0)]],
      nonPracticeDataCreationSystems: [this.count.nonPracticeDataCreationSystems || 0, [Validators.required, Validators.min(0)]],
      deployedDataAnalysisSystems: [this.count.deployedDataAnalysisSystems || 0, [Validators.required, Validators.min(0)]],
      databasesPerDeployment: [this.count.databasesPerDeployment || 0, [Validators.required, Validators.min(0)]],
      notes: [this.count?.notes],
      snomedPractices: [this.count?.snomedPractices]
    });
    const editText = this.translate.instant('global.word.edit');
    const dataAnalysisText = this.translate.instant('views.usageLog.institutions.dataAnalysis.title');
    this.title = `${editText} ${dataAnalysisText}`;
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
          this.alerts.push({ type: 'danger', msg: 'Network request failure [26]: please try again later.' });
          this.submitting = false;
        }
      });
  }
  

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}