import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbDatepicker, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-institution-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbAlert, ReactiveFormsModule, NgbDatepicker, NgbDatepickerModule, CompareTextPipe,TranslateModule],
  templateUrl: './add-institution-modal.component.html',
  styleUrl: './add-institution-modal.component.scss'
})
export class AddInstitutionModalComponent implements OnInit {
  @Input() country!: any;
  @Input() usageReport!: any;

  form!: FormGroup;
  alerts: any[] = [];
  submitting: boolean = false;
  institution: any = {
    startDate: null,
    country: null
  };

  datepickers = {
    startDate: false,
    endDate: false
  };
submitAttempted: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private commercialUsageService: CommercialUsageService
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      country: [this.country, Validators.required],
      name: ['', Validators.required],
      note: ['']
    });

    // Set the institution's country
    this.institution.country = this.country;
  }

  add(): void {
    this.submitting = true;
    this.alerts = [];

    const formValue = this.form.value;
    if(formValue.startDate){
      this.form.patchValue({
        startDate: this.formatDate(formValue.startDate)
      })
    }

    if(formValue.endDate){
      this.form.patchValue({
        endDate: this.formatDate(formValue.endDate)
      })
    }
    
    // Make the service call and handle the response with subscribe()
    this.commercialUsageService.addUsageEntry(this.usageReport, this.form.value)
      .subscribe({
        next: (result) => {
          this.activeModal.close(result); // Success handler
        },
        error: () => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [5]: please try again later.' }); // Error handler
          this.submitting = false;
        }
      });
  }

  
  
  
  

  // Close alert
  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  // Cancel function
  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  // openDatepicker(picker: 'startDate' | 'endDate'): void {
  //   this.datepickers[picker] = true;
  // }
  
  // dateOptions = {
  //   formatYear: 'yyyy',
  //   startingDay: 1,
  //   format: 'yyyy-MM-dd'
  // };

  formatDate(date: { day: number, month: number, year: number } | null): string | null {
    if (date) {
      const year = date.year;
      const month = date.month < 10 ? '0' + date.month : date.month;
      const day = date.day < 10 ? '0' + date.day : date.day;
      return `${year}-${month}-${day}`;
    }
    return null;
  }


  
}