import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { ROUTES } from 'src/app/routes-config'
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { UsageReportStateUtilsService } from 'src/app/services/usage-report-state-utils/usage-report-state-utils.service';
import { ScrollTrackerDirective } from 'src/app/directives/scroll-tracker.directive';
/**
 * Component for displaying usage reports.
 */
@Component({
  selector: 'app-usage-reports',
  standalone: true,
  imports: [CommonModule, ScrollTrackerDirective, EnumPipe,TranslateModule],
  templateUrl: './usage-reports.component.html',
  styleUrl: './usage-reports.component.scss'
})
export class UsageReportsComponent implements OnInit {
  routes = ROUTES;
  /**
   * Array of usage reports.
   */
  usageReports: any[] = [];

  /**
   * Field to order the usage reports by.
   */
  orderByField = 'submitted';

  /**
   * Whether to reverse the sort order.
   */
  reverseSort = false;

  /**
   * Current page number.
   */
  page = 0;

  /**
   * Number of usage reports to display per page.
   */
  pageSize = 50;

  /**
   * Whether there are more usage reports to load.
   */
  hasMoreData = true;
  isAdmin: boolean = false; 

  /**
   * Whether usage reports are currently being downloaded.
   */
  downloadingReports = false;

  loading = true;

  constructor(private commercialUsageService: CommercialUsageService, private authenticationService: AuthenticationSharedService, private router: Router,private usageReportStateUtilsService: UsageReportStateUtilsService) {}

  /**
   * Initializes the component by loading the first page of usage reports.
   */
  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isAdmin();
    this.loadMoreUsageReports();
  }

  /**
   * Loads more usage reports from the server.
   *
   * @param reset Whether to reset the pagination and load the first page again.
   */
  loadMoreUsageReports(reset = false): void {
    this.loading = true;
    if (this.downloadingReports || !this.hasMoreData) {
      return;
    }
    this.downloadingReports = true;
    if (reset) {
      this.page = 0;
      
      this.usageReports = [];
      this.hasMoreData = true;
    }
    const orderByParam = `${this.orderByField},${this.reverseSort ? 'desc' : 'asc'}`;
    this.commercialUsageService.getSubmittedUsageReports(this.page, this.pageSize, orderByParam)
      .subscribe({next:results => {
        if (results.length < this.pageSize) {
          this.hasMoreData = false;
        }
        this.usageReports = [...this.usageReports, ...results];
        this.page++;
      },
      error:(error) => {
        this.loading = false;
        this.downloadingReports = false;
        console.error('Error fetching usage reports', error);

      },
    });
  }

  /**
   * Toggles the sort order of the usage reports by the specified field.
   *
   * @param field The field to sort by.
   * @example
   * ```typescript
   * this.toggleField('submitted'); // Sort by submitted date in ascending order
   * this.toggleField('submitted'); // Sort by submitted date in descending order
   * ```
   */
  toggleField(field: string): void {
    if (this.orderByField === field) {
      this.reverseSort = !this.reverseSort;
    } else {
      this.orderByField = field;
      this.reverseSort = false;
    }
    this.loadMoreUsageReports(true);
  }

  /**
   * Navigates to the review usage report page for the specified report.
   *
   * @param usageReport The usage report to review.
   */
  goToReviewUsageReport(usageReport: any): void {
    this.router.navigate([this.routes.usageReportsReview, encodeURIComponent(usageReport.commercialUsageId
    )]);
  }

  /**
   * Returns a string representation of the hospitals associated with the specified usage report.
   *
   * @param usageReport The usage report to get hospital details for.
   * @returns A string representation of the hospitals.
   * @example
   * ```typescript
   * const usageReport = { hospitals: ['Hospital A', 'Hospital B'] };
   * console.log(this.usageReportHospitals(usageReport)); // Output: "Hospital A, Hospital B"
   * ```
   */
  usageReportHospitals(usageReport: any): number {
    return this.usageReportStateUtilsService.usageReportHospitals(usageReport);
  }

    /**
   * Returns a string representation of the practices associated with the specified usage report.
   *
   * @param usageReport The usage report to get practice details for.
   * @returns A string representation of the practices.
   * @example
   * ```typescript
   * const usageReport = { practices: ['Practice A', 'Practice B'] };
   * console.log(this.usageReportPractices(usageReport)); // Output: "Practice A, Practice B"
   * ```
   */
    usageReportPractices(usageReport: any): number {
    return this.usageReportStateUtilsService.usageReportPractices(usageReport);
  }
}


