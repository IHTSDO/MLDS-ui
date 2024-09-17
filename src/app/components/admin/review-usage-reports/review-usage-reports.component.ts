import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { CommonModule } from '@angular/common';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';

/**
 * Review Usage Reports Component
 * 
 * This component generates a CSV report of usage data.
 * 
 * Example:
 * <app-review-usage-reports></app-review-usage-reports>
 */
@Component({
  selector: 'app-review-usage-reports',
  standalone: true,
  imports: [CommonModule, EnumPipe,TranslateModule],
  templateUrl: './review-usage-reports.component.html',
  styleUrls: ['./review-usage-reports.component.scss']
})
export class ReviewUsageReportsComponent implements OnInit {
  generatingCsv = false;
  homeMember: string | undefined; // Using undefined to better handle unset values
session: any;

  constructor(
    private authenticationService: AuthenticationSharedService,
    private commercialusageService: CommercialUsageService,
  ) {}

  ngOnInit(): void {
    const userDetails = this.authenticationService.getUserDetails();
    this.homeMember = userDetails?.member?.['key'];
    console.log('Home Member:', this.homeMember);
    this.session  = userDetails?.member?.['key'];
  }

  generateCsv(): void {
    if (this.homeMember === undefined) {
      console.error('Home member is not defined');
      return;
    }
    
    this.generatingCsv = true;
    console.log('Generating CSV for Home Member:', this.homeMember);

    this.commercialusageService.getReviewUsageReport().subscribe(
      data => {
        const csvString = this.createCsvString(data);
        this.downloadCsv(csvString);
      },
      error => {
        console.error('Error fetching usage reports', error);
      },
      () => {
        this.generatingCsv = false;
      }
    );
  }

  private createCsvString(data: any[]): string {
    const csvHeader = [
      "Affiliate Id", "Member Key", "Deployment Country", "Affiliate Country", "Start Date",
      "End Date", "Standing State", "Created", "Agreement Type", "Applicant", "Type",
      "Organization Name", "Organization Type", "Current Usage", "Planned Usage", "Purpose",
      "Implementation Status", "Other Activities", "Snomed Practices", "Hospital Staffing Practice",
      "Databases Per Deployment", "Deployed Data Analysis Systems", "Hospitals"
    ].map(field => `"${field}"`).join(",") + "\n";

    // Use arrow function to preserve `this` context
    const csvRows = data
      .filter(item => this.shouldIncludeItem(item))
      .map(item => this.formatItem(item))
      .join("\n");

    return csvHeader + csvRows;
  }

  private shouldIncludeItem = (item: any): boolean => {
    if (this.homeMember === undefined) {
      console.error('homeMember is undefined');
      return false;
    }
    return this.homeMember === "IHTSDO" || item[2] === this.homeMember || item[3] === this.homeMember;
  };

  private formatItem(item: any): string {
    return [
      item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10],
      item[11], item[12], item[13], item[14], item[15], item[16], item[17], item[18], item[19], item[20], item[21], item[22]
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(",");
  }

  private downloadCsv(csvString: string): void {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'usage-reports.csv');
  }
}