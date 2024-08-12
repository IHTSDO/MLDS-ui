import { Component } from '@angular/core';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { saveAs } from 'file-saver';

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
  imports: [],
  templateUrl: './review-usage-reports.component.html',
  styleUrls: ['./review-usage-reports.component.scss']
})
export class ReviewUsageReportsComponent {
  /**
   * Flag indicating whether the CSV is being generated.
   */
  generatingCsv = false;

  /**
   * Constructor
   * 
   * @param usageReportsService Usage Reports Service
   */
  constructor(private usageReportsService: UsageReportsService) {}

  /**
   * Generate CSV report of usage data.
   * 
   * This method fetches the usage data from the Usage Reports Service, 
   * creates a CSV string from the data, and downloads the CSV file.
   * 
   * Example:
   * this.generateCsv();
   */
  generateCsv(): void {
    this.generatingCsv = true;
    this.usageReportsService.getReviewUsageReport() // Fetch usage data from the Usage Reports Service
      .subscribe(
        data => {
          const csvString = this.createCsvString(data); // Create a CSV string from the data
          this.downloadCsv(csvString); // Download the CSV file
        },
        error => {
          console.error('Error fetching usage reports', error); // Log any errors
        },
        () => {
          this.generatingCsv = false; // Set the generatingCsv flag to false when the operation is complete
        }
      );
  }

  /**
   * Create a CSV string from the usage data.
   * 
   * This method creates a CSV header and rows from the usage data.
   * 
   * @param data Usage data
   * @returns CSV string
   * 
   * Example:
   * const csvString = this.createCsvString(data);
   */
  private createCsvString(data: any[]): string {
    const csvHeader = [
      "Affiliate Id", "Member Key", "Deployment Country", "Affiliate Country", "Start Date",
      "End Date", "Standing State", "Created", "Agreement Type", "Applicant", "Type",
      "Organization Name", "Organization Type", "Current Usage", "Planned Usage", "Purpose",
      "Implementation Status", "Other Activities", "Snomed Practices", "Hospital Staffing Practice",
      "Databases Per Deployment", "Deployed Data Analysis Systems", "Hospitals"
    ].map(field => `"${field}"`).join(",") + "\n"; // Create the CSV header

    const csvRows = data.filter(this.shouldIncludeItem).map(this.formatItem).join("\n"); // Create the CSV rows
    return csvHeader + csvRows; // Return the CSV string
  }


  /**
 * Filter usage data to include only items that match the session member key.
 * 
 * This method filters the usage data to include only items where the 
 * session member key matches the affiliate country or deployment country.
 * 
 * @param item Usage data item
 * @returns Whether to include the item
 * 
 * Example:
 * const filteredData = data.filter(this.shouldIncludeItem);
 */
private shouldIncludeItem(item: any): boolean {
  const sessionMemberKey = "IHTSDO"; // This should be replaced with the actual session member key
  return sessionMemberKey === "IHTSDO" || item[2] === sessionMemberKey || item[3] === sessionMemberKey;
}

/**
 * Format a usage data item as a CSV row.
 * 
 * This method formats a usage data item as a CSV row by joining the 
 * item's fields with commas and wrapping each field in double quotes.
 * 
 * @param item Usage data item
 * @returns CSV row
 * 
 * Example:
 * const csvRow = this.formatItem(item);
 */
private formatItem(item: any): string {
  return [
    item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10],
    item[11], item[12], item[13], item[14], item[15], item[16], item[17], item[18], item[19], item[20], item[21], item[22]
  ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(",");
}

/**
 * Download the CSV file.
 * 
 * This method creates a blob from the CSV string and saves it as a file.
 * 
 * @param csvString CSV string
 * 
 * Example:
 * this.downloadCsv(csvString);
 */
private downloadCsv(csvString: string): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'review-usage-reports.csv');
}
}