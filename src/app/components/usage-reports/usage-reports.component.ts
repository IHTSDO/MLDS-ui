import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service'

/**
 * Component for displaying usage reports.
 */
@Component({
  selector: 'app-usage-reports',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule],
  templateUrl: './usage-reports.component.html',
  styleUrl: './usage-reports.component.scss'
})
export class UsageReportsComponent implements OnInit {
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

  /**
   * Whether usage reports are currently being downloaded.
   */
  downloadingReports = false;

  constructor(private usageReportsService: UsageReportsService) {}

  /**
   * Initializes the component by loading the first page of usage reports.
   */
  ngOnInit(): void {
    this.loadMoreUsageReports();
  }

  /**
   * Loads more usage reports from the server.
   *
   * @param reset Whether to reset the pagination and load the first page again.
   */
  loadMoreUsageReports(reset = false): void {
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
    this.usageReportsService.getSubmittedUsageReports(this.page, this.pageSize, orderByParam)
      .subscribe(results => {
        if (results.length < this.pageSize) {
          this.hasMoreData = false;
        }
        this.usageReports = [...this.usageReports, ...results];
        this.page++;
      },
      error => {
        console.error('Error fetching usage reports', error);
      },
      () => {
        this.downloadingReports = false;
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
    // Implementation for reviewing a usage report
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
  usageReportHospitals(usageReport: any): string {
    // Implementation to get hospital details from the usage report
    return '';
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
  usageReportPractices(usageReport: any): string {
    // Implementation to get practice details from the usage report
    return '';
  }
}