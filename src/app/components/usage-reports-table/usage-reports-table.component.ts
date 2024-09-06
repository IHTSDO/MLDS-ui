import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { OrderByPipe } from "../../pipes/order-by/order-by.pipe";
import { UsageReportStateUtilsService } from 'src/app/services/usage-report-state-utils/usage-report-state-utils.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { DateSortPipe } from 'src/app/pipes/date-sort/date-sort.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usage-reports-table',
  standalone: true,
  imports: [CommonModule,DateSortPipe],
  templateUrl: './usage-reports-table.component.html',
  styleUrl: './usage-reports-table.component.scss'
})
export class UsageReportsTableComponent implements OnInit {
  
  @Input() affiliate: any;
  @Input() showAllColumns: boolean = true;
  @Input() showViewAll: boolean = false;

  constructor(public usageReportsUtils: UsageReportStateUtilsService, private usageReportsService: UsageReportsService, private router: Router) {
  }

  ngOnInit(): void {
  }

  viewUsageReports() {
    this.router.navigate(['/usageReports']);
  }

}
