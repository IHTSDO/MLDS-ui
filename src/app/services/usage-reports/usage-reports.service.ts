import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AffiliateService } from '../affiliate/affiliate.service';
import { UsageReportStateUtilsService } from '../usage-report-state-utils/usage-report-state-utils.service';
import { RetractUsageReportComponent } from 'src/app/components/retract-usage-report/retract-usage-report.component';

/**
 * Service for retrieving usage reports.
 */
@Injectable({
  providedIn: 'root'
})
export class UsageReportsService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private affiliateService: AffiliateService,
    private usageReportStateUtils: UsageReportStateUtilsService,
    private modalService: NgbModal

  ) {}

  usageReportCountries(usageReport: any): number {
    return usageReport.countries.length;
  }

  usageReportHospitals(usageReport: any): number {
    return usageReport.entries.length;
  }

  usageReportPractices(usageReport: any): number {
    return usageReport.countries.reduce((total: number, count: any) => {
      return total + (count.snomedPractices || 0);
    }, 0);
  }

  isInvoiceSent(usageReport: any): boolean {
    return this.usageReportStateUtils.isInvoiceSent(usageReport.state);
  }

  isPendingInvoice(usageReport: any): boolean {
    return this.usageReportStateUtils.isPendingInvoice(usageReport.state);
  }

  isSubmitted(usageReport: any): boolean {
    return this.usageReportStateUtils.isSubmitted(usageReport.state);
  }

  // openAddUsageReportModal(affiliate: any): void {
  //   const modalRef = this.modalService.open(AddUsageReportModalComponent, {
  //     size: 'lg',
  //     backdrop: 'static'
  //   });
  //   modalRef.componentInstance.affiliateId = affiliate.affiliateId;
  // }

  goToUsageReport(usageReport: any): void {
    this.router.navigate(['/usageReports/usageLog', encodeURIComponent(usageReport.commercialUsageId)]);
  }

  goToReviewUsageReport(usageReport: any): void {
    this.router.navigate(['/usageReportsReview', encodeURIComponent(usageReport.commercialUsageId)]);
  }

  affiliateIsCommercial(affiliate: any): boolean {
    return this.affiliateService.affiliateIsCommercial(affiliate);
  }

  anySubmittedUsageReports(affiliate: any): boolean {
    return affiliate.commercialUsages.some((usageReport: any) => {
      return !this.usageReportStateUtils.isWaitingForApplicant(usageReport.state) && !usageReport.effectiveTo;
    });
  }

  retractUsageReport(commercialUsageReport: any): void {
    const modalRef = this.modalService.open(RetractUsageReportComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.commercialUsageReport = commercialUsageReport;
    modalRef.result
      .then((result) => {
        if (result && result.data && result.data.commercialUsageId) {
          this.router.navigate(['/usageReports/usageLog/', result.data.commercialUsageId]);
        }
      })
      .catch((error) => {
        // Handle the case where the modal is dismissed or an error occurs
        console.error('Modal dismissed or error occurred:', error);
      });
  }
}