import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UsageReportStateUtilsService } from 'src/app/services/usage-report-state-utils/usage-report-state-utils.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { DateSortPipe } from 'src/app/pipes/date-sort/date-sort.pipe';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

@Component({
  selector: 'app-usage-reports-table',
  standalone: true,
  imports: [CommonModule,DateSortPipe, TranslateModule, CompareTextPipe],
  templateUrl: './usage-reports-table.component.html',
  styleUrl: './usage-reports-table.component.scss'
})
export class UsageReportsTableComponent implements OnInit {
  
  
  @Input() affiliate: any;
  @Input() showAllColumns: boolean = true;
  @Input() showViewAll: boolean = false;
  isAdminOrStaff = false;
  sortedUsages: any[] = [];

  isUserDashboardPage: boolean = false;

  constructor(public usageReportsUtils: UsageReportStateUtilsService, private usageReportsService: UsageReportsService, private router: Router, private session: AuthenticationSharedService,) {
  }

  ngOnInit(): void {
    this.isAdminOrStaff = this.session.isStaffOrAdmin();
    this.sortUsages();
    this.isUserDashboardPage = this.router.url.includes('userDashboard');
  }
  openAddUsageReportModal(affiliate: any): void {
    this.usageReportsService.openAddUsageReportModal(affiliate);
  }

  viewUsageReports() {
    if (this.isAdminOrStaff) {
      this.router.navigate(['/usageReports']);
    } else {
      this.router.navigate(['/usageReport']);
    }
  }
   // Method to navigate to the report's detail page
   navigateToUsageReport(usageReport: any) {
    const usageReportId = encodeURIComponent(usageReport.commercialUsageId);
    if (this.isAdminOrStaff) {
      this.router.navigate(['/usageReports/usageLog', usageReportId]);
    } else {
      this.router.navigate(['/usageReport/usageLog', usageReportId]);
    }
  }

  isActiveUsageReport(usageReport: any): boolean {
    return !!usageReport.effectiveTo;
  }


  sortUsages() {
    if (this.affiliate?.commercialUsages) {

      const groupedByYear = this.groupByYear(this.affiliate.commercialUsages);
      this.sortedUsages = [];

      Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a)).forEach(year => {
        const usagesForYear = groupedByYear[year];
        const activeReports = usagesForYear.filter((report: any) => this.isActiveUsageReport(report));
        const inactiveReports = usagesForYear.filter((report: any) => !this.isActiveUsageReport(report));

        const sortedActive = activeReports.sort((a: { startDate: number; }, b: { startDate: number; }) => b.startDate - a.startDate);
        const sortedInactive = inactiveReports.sort((a: { startDate: number; }, b: { startDate: number; }) => b.startDate - a.startDate);
        this.sortedUsages.push(...sortedInactive,...sortedActive);

      });
    }
  }


  groupByYear(reports: any[]) {
    return reports.reduce((groups, report) => {
      const year = new Date(report.startDate).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(report);
      return groups;
    }, {});
  }


}
