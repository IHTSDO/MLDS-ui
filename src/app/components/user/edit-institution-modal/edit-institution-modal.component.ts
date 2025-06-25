import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbDatepicker, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { ModalComponent } from "../../common/modal/modal.component";

@Component({
    selector: 'app-edit-institution-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbAlert, NgbDatepicker, NgbDatepickerModule, TranslateModule, CompareTextPipe, ModalComponent],
    templateUrl: './edit-institution-modal.component.html',
    styleUrl: './edit-institution-modal.component.scss'
})
export class EditInstitutionModalComponent implements OnInit {
  @Input() country: any;
  @Input() institution: any;
  @Input() usageReport: any;

  formInstitution: FormGroup;
  alerts: any[] = [];
  submitting = false;
  attemptedSubmit = false;

  datepickers = {
    startDate: false,
    endDate: false
  };

  dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1,
    format: 'yyyy-MM-dd'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private commercialUsageService: CommercialUsageService,
    private fb: FormBuilder
  ) {
    // Initialize formInstitution in the constructor
    this.formInstitution = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.formInstitution = this.fb.group({
      name: [this.institution?.name || '', Validators.required],
      startDate: [this.convertDateToNgb(this.institution?.startDate), Validators.required],
      endDate: [this.convertDateToNgb(this.institution?.endDate)],
      note: [this.institution?.note || '']
    });
  }

  // Helper method to convert string date to NgbDateStruct
  convertDateToNgb(dateString: string): NgbDateStruct | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  // Helper method to convert NgbDateStruct back to string
  convertNgbToDateString(date: NgbDateStruct | null): string | null {
    if (!date) {
      return null;
    }
    return `${date.year}-${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}`;
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  updateInstitution(): void {
    this.submitting = true;
    this.alerts = [];

    if (this.formInstitution.invalid) {
      this.alerts.push({ type: 'danger', msg: 'Please fill all required fields.' });
      this.submitting = false;
      return;
    }

    const updatedInstitution = { 
      ...this.institution, 
      ...this.formInstitution.value,
      startDate: this.convertNgbToDateString(this.formInstitution.get('startDate')?.value),
      endDate: this.convertNgbToDateString(this.formInstitution.get('endDate')?.value)
    };

    // Uncomment to make the service call for updating institution data
    this.commercialUsageService.updateUsageEntry(this.usageReport, updatedInstitution)
      .subscribe({
        next: (result) => this.activeModal.close(result),
        error: () => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure: please try again later.' });
          this.submitting = false;
        }
      });
  }

  openDatepicker(datepickerName: 'startDate' | 'endDate'): void {
    this.datepickers[datepickerName] = true;
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}