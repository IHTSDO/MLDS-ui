import { Component, OnInit } from '@angular/core';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { UsageReportsTableComponent } from "../../common/usage-reports-table/usage-reports-table.component";
import { CommonModule } from '@angular/common';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';

@Component({
  selector: 'app-user-usage-reports-table',
  standalone: true,
  imports: [UsageReportsTableComponent,CommonModule,TranslateModule,CompareTextPipe],
  templateUrl: './user-usage-reports-table.component.html',
  styleUrl: './user-usage-reports-table.component.scss'
})
export class UserUsageReportsTableComponent implements OnInit {
  showAllColumns: boolean = true;
  showViewAll: boolean = false;
  affiliates: any;

  constructor(public usageReportsService: UsageReportsService,private affiliateService: AffiliateService) {}

  ngOnInit(): void {
    this.affiliateService.myAffiliates().subscribe((affiliates: any[]) => {
      this.affiliates = affiliates;
    });
    
  }

  isActiveUsageReport(usageReport: any): boolean {
    return !!usageReport.effectiveTo;
  }

  setShowAllColumns(set: boolean): void {
    this.showAllColumns = set;
  }

  setShowViewAll(set: boolean): void {
    this.showViewAll = set;
  }
}
