import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { EmbeddableUsageLogComponent } from "../embeddable-usage-log/embeddable-usage-log.component";
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

@Component({
  selector: 'app-full-page-usage-log',
  standalone: true,
  imports: [CommonModule, FormsModule, EmbeddableUsageLogComponent, TranslateModule, CompareTextPipe],
  templateUrl: './full-page-usage-log.component.html',
  styleUrl: './full-page-usage-log.component.scss'
})
export class FullPageUsageLogComponent implements OnInit {
  usageLogCanSubmit = true;
  usageReportReady: any = {};
  commercialUsageReport: any = {};
  isEditable: boolean = false;
  readOnly: boolean = false;
  isActiveUsage: boolean = false;
  isAffiliateApplying: boolean = false;
  geographicAlerts: any[] = [];
  availableCountries: any[] = [];
  selectedCountryCodesToAdd: string[] = [];
  usageByCountryList: any[] = [];
  implementationStatusOptions: any[] = [];
  homeCountry: any = {};
  isAdminOrStaff: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private commercialUsageService: CommercialUsageService,
    private session: AuthenticationSharedService
  ) {}

  ngOnInit() {
    this.isAdminOrStaff = this.session.isStaffOrAdmin();
    this.usageReportReady = this.loadUsageReportFromRoute();
  }

  loadUsageReportFromRoute(): void {
    const usageReportId = this.route.snapshot.paramMap.get('commercialUsageId');
  
    if (usageReportId) {
      this.commercialUsageService.getUsageReport(usageReportId).subscribe({
        next: (result: any) => {
          this.commercialUsageReport = result;
        },
        error: (err: any) => {
          console.error('Failed to get initial usage log by param', err);
        }
      });
    } else {
      console.error('Missing usage report id');
    }
  }  
  
   // Helper function to check if commercialUsageReport has keys
   hasCommercialUsageReport(): boolean {
    return this.commercialUsageReport && Object.keys(this.commercialUsageReport).length > 0;
  }

  goToUsageReport(): void {
    window.history.back();
  }
 
  closeAlert(index: number) {
    this.geographicAlerts.splice(index, 1);
  }
}