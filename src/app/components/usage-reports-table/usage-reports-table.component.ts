import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { OrderByPipe } from "../../pipes/order-by/order-by.pipe";
import { UsageReportStateUtilsService } from 'src/app/services/usage-report-state-utils/usage-report-state-utils.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';

@Component({
  selector: 'app-usage-reports-table',
  standalone: true,
  imports: [CommonModule, OrderByPipe],
  templateUrl: './usage-reports-table.component.html',
  styleUrl: './usage-reports-table.component.scss'
})
export class UsageReportsTableComponent implements OnInit {
  
  @Input() affiliate: any;
  showAllColumns: boolean = true;
  showViewAll: boolean = false;

  constructor(public usageReportsUtils: UsageReportStateUtilsService, private usageReportsService: UsageReportsService) {
  }

  ngOnInit(): void {
  }

}
