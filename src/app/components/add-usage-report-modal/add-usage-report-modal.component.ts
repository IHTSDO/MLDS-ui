import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';

@Component({
  selector: 'app-add-usage-report-modal',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-usage-report-modal.component.html',
  styleUrl: './add-usage-report-modal.component.scss'
})
export class AddUsageReportModalComponent implements OnInit {
  alerts: Array<{ type: string, msg: string }> = [];
  ranges: any[] = [];
  selectedRange: any;
  submitting = false;
  affiliateId!: number; // This should be passed in from the parent component
  addRangeForm!: FormGroup; // Use FormGroup to ensure proper typing

  constructor(
    public activeModal: NgbActiveModal,
    private commercialUsageService: CommercialUsageService,
    private router: Router,
    private fb: FormBuilder // Add FormBuilder to your constructor
  ) {}

  ngOnInit(): void {
    this.ranges = this.commercialUsageService.generateRanges();
    this.selectedRange = this.ranges[0];

    // Initialize the form with FormBuilder
    this.addRangeForm = this.fb.group({
      selectedRange: [this.selectedRange, Validators.required]
    });

    console.log(this.selectedRange);
  }

  add(): void {
    if (this.addRangeForm.invalid) {

      return;
    }

    this.submitting = true;
    this.alerts = [];

    const { startDate, endDate } = this.addRangeForm.get('selectedRange')?.value;
    console.log(this.affiliateId);
    this.commercialUsageService?.createUsageReport(this.affiliateId.toString(), startDate.toString(), endDate.toString()).subscribe({
      next: (result) => {
       
        console.log(result);
        const commercialUsageId = result.commercialUsageId;
        this.router.navigate(['/usageReports/usageLog', commercialUsageId]);
        this.activeModal.close(result);
      },
      error: () => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [25]: please try again later.' });
        this.submitting = false;
      }
    });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  open(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}