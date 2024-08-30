import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';

@Component({
  selector: 'app-retract-usage-report',
  standalone: true,
  imports: [CommonModule,NgbAlert],
  templateUrl: './retract-usage-report.component.html',
  styleUrl: './retract-usage-report.component.scss'
})
export class RetractUsageReportComponent  {
  @Input() commercialUsageReport: any;
  submitting = false;
  alerts: any[] = [];
type: any|string;
close: any;


  constructor(private commercialUsageService: CommercialUsageService,public activeModal: NgbActiveModal
    ,public userAffiliateService: UserAffiliateService
  ) {}

  retract() {
    this.submitting = true;
    this.alerts = []; 

    // Replace with your actual service call
    this.commercialUsageService.retractUsageReport(this.commercialUsageReport)
      .subscribe({
        next: (result) => {
          // Refresh affiliate and handle success
          this.userAffiliateService.refreshAffiliate();
          this.activeModal.close(result);
        },
        error: (msg) => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [40]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  closeAlert(index: number) {
    this.alerts.splice(index, 1);
  }
  cancel() {
    this.activeModal.dismiss('cancel');
  }
}