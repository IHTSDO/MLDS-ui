import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { ROUTES } from 'src/app/routes-config';
import { AffiliateDetailsSummaryComponent } from "../../common/affiliate-details-summary/affiliate-details-summary.component";

@Component({
  selector: 'app-review-usage-report-admin',
  standalone: true,
  imports: [CommonModule, NgbAlertModule, NgbModule, FormsModule, AffiliateDetailsSummaryComponent],
  templateUrl: './review-usage-report-admin.component.html',
  styleUrl: './review-usage-report-admin.component.scss'
})
export class ReviewUsageReportAdminComponent  implements OnInit {

collapsePanel = {
  usage: true,
  sublicenseInstitutions: true,
  otherActivities: true,
};
  
  usageReportId: string | null = null;
  usageReport: any = {};
  affiliate: any = {};
  usageByCountry: any = {};
  usageByCountryList: any[] = [];
  alerts: any[] = [];
  submitting = false;
  usageReportsUtils: any;
  routes = ROUTES;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commercialUsageService: CommercialUsageService,
    private affiliateService: AffiliateService,
    private usageReportsService: UsageReportsService
  ) {
    this.usageReportsUtils = usageReportsService;
  }

  ngOnInit(): void {
    this.loadUsageReport();
  }

  loadUsageReport():void{
   
    this.route.paramMap.subscribe(params => {
      const usageReportId = params.get('commercialUsageId');
      if (usageReportId) {
        this.findUsageReport(usageReportId);
      }
    });
  }
  goBackToPrevious(): void {
    this.router.navigate([this.routes.usageReportsReview]);
  }
  togglePanel(panel: 'usage' | 'sublicenseInstitutions' | 'otherActivities'): void {
    this.collapsePanel[panel] = !this.collapsePanel[panel];
  }
  private lookupUsageByCountryOrNull(country: any): any {
    const countryCode = country.isoCode2;
    return this.usageByCountry[countryCode];
  }
  closeAlert(_t10: any) {
    throw new Error('Method not implemented.');
    }
  private lookupUsageByCountryOrCreate(country: any): any {
    const countryCode = country.isoCode2;
    let countrySection = this.lookupUsageByCountryOrNull(country);
    if (!countrySection) {
      countrySection = {
        country: country,
        entries: [],
        count: {
          snomedPractices: 0,
          hospitalsStaffingPractices: 0,
          dataCreationPracticesNotPartOfHospital: 0,
          nonPracticeDataCreationSystems: 0,
          deployedDataAnalysisSystems: 0,
          databasesPerDeployment: 0,
          country: country
        }
      };
      this.usageByCountry[countryCode] = countrySection;
      this.usageByCountryList.push(countrySection);
    }
    return countrySection;
  }

  private sortByNameProperty(array: any[], expression: string): void {
    array.sort((a, b) => {
      const x = (a[expression] || '').toLowerCase();
      const y = (b[expression] || '').toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  private findUsageReport(reportId: string): void {
    this.commercialUsageService.getUsageReport(reportId).subscribe(
      
      /**
       * Handle the successful response
       *
       * @param {any} result The usage report data
       */
      result => {
       
        this.usageReport = result;
  
        // Process affiliate data
        this.affiliate = this.usageReport?.affiliate|| {};
  
        if (this.affiliate?.affiliateId) {
          this.affiliateService.affiliate(this.affiliate?.affiliateId).subscribe(
            /**
             * Handle the successful affiliate data response
             *
             * @param {any} affiliateResult The affiliate data
             */
            affiliateResult => {
              this.affiliate = affiliateResult;
            },
            /**
             * Handle the error response for affiliate data
             *
             * @param {any} affiliateError The error object
             */
            affiliateError => {
              console.error("Failed to load affiliate data:", affiliateError);
            }
          );
        }
  
        // Process usage report countries
        this.usageReport?.countries.forEach((usageCount: any) => {
          const countrySection = this.lookupUsageByCountryOrCreate(usageCount.country);
          countrySection.count = usageCount;
        });
  
        // Process usage report entries
        this.usageReport.entries.forEach((usageEntry: any) => {
          const countrySection = this.lookupUsageByCountryOrCreate(usageEntry.country);
          countrySection.entries.push(usageEntry);
          this.sortByNameProperty(countrySection.entries, 'name');
        });
  
        // Sort the country list
        this.sortByNameProperty(this.usageByCountryList, 'country.commonName');
      },
      /**
       * Handle the error response
       *
       * @param {any} message The error object
       */
      message => {
        console.error("Find usage report failure:", message);
        this.router.navigate(['/usageReportsReview']);
      }
    );
  }
  

  updateUsageReport(newState: string): void {
    this.alerts = [];
    this.submitting = true;

    this.commercialUsageService.updateUsageReport(this.usageReport, newState)
      .subscribe({
        next: (result) => {
          this.router.navigate(['/usageReportsReview']);
          this.submitting = false;
        },
        error: (message) => {
          console.error("failed to update usage report:", message);
          this.alerts.push({ type: 'danger', msg: 'Network request failure [31]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  retractUsageReport(): void {
  
      this.usageReportsService.retractUsageReport(this.usageReport);

  }
}