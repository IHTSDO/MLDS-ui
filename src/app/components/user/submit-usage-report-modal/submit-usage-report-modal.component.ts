import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-submit-usage-report-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbAlert,TranslateModule,CompareTextPipe,ModalComponent],
  templateUrl: './submit-usage-report-modal.component.html',
  styleUrl: './submit-usage-report-modal.component.scss'
})
export class SubmitUsageReportModalComponent implements OnInit {
  commercialUsageReport: any;  // Type this appropriately
  usageByCountryList: any;     // Type this appropriately
  submitting: boolean = false;
  alerts: { type: string, msg: string }[] = [];
  attemptedSubmit: boolean = false;
  addRangeForm: FormGroup;

  constructor(
    private commercialUsageService: CommercialUsageService,
    private router: Router,
    private userAffiliateService: UserAffiliateService,
    private sessionService: AuthenticationSharedService,
    public modalService: NgbModal,
    private fb: FormBuilder
  ) {
    // Initialize form group (if needed for the form)
    this.addRangeForm = this.fb.group({
      // Define your form controls here
    });
  }

  ngOnInit(): void {
    // Load commercialUsageReport and usageByCountryList here if needed
  }

  submit(): void {
    this.submitting = true;
    this.alerts = [];

    this.commercialUsageService.submitUsageReport(this.commercialUsageReport).subscribe({
      next: (result) => {
        if (this.sessionService.isAdmin()) {
          this.router.navigate(['/affiliateManagement', this.commercialUsageReport.affiliate.affiliateId]);
        } else {
          this.userAffiliateService.refreshAffiliate();
          this.router.navigate(['/userDashboard']);
        }
        this.modalService.dismissAll(result);
      },
      error: () => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [41]: please try again later.' });
        this.submitting = false;
      }
    });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  cancel(): void {
    this.modalService.dismissAll();
  }

  open(event: any, datepickerName: string): void {
    event.preventDefault();
    event.stopPropagation();
    // Implement date picker logic if necessary
  }
}