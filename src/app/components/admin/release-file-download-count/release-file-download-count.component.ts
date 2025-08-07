import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ReleaseFileDownloadCountService } from 'src/app/services/release-file-download-count/release-file-download-count.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { DateFilterUtilsService } from 'src/app/services/date-filter-utils/date-filter-utils.service';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * Release File Download Count component
 *
 * This component displays the release file download count for a given date range and allows users to filter by excluding admin and staff.
 */
@Component({
    selector: 'app-release-file-download-count',
    imports: [CommonModule, FormsModule, TranslateModule, CompareTextPipe, NgbDatepickerModule],
    templateUrl: './release-file-download-count.component.html',
    styleUrl: './release-file-download-count.component.scss'
})
export class ReleaseFileDownloadCountComponent implements OnInit {

  /**
   * Whether the component is submitting a request
   */
  submitting = false;

  /**
   * From date for the download count
   */
  fromDate: any;

  /**
   * To date for the download count
   */
  toDate: any;

  /**
   * Release file download counts data
   */
  releaseFileDownloadCounts: any;

  ExcludeAdminAndStaff = true;

  downloading = false;

  orderByField: string = 'count'; 
  
  reverseSort: boolean = true;

  constructor(private releaseFileDownloadCountService: ReleaseFileDownloadCountService, private dateFilterUtils: DateFilterUtilsService) {}

  /**
   * Initializes the component by setting the initial date range to the previous week
   */
  ngOnInit() {
    const { fromDate, toDate } = this.dateFilterUtils.previousMonth();
    this.fromDate = this.dateFilterUtils.convertToNgbDateStruct(fromDate);
    this.toDate = this.dateFilterUtils.convertToNgbDateStruct(toDate);
    this.loadReleaseFileDownloadCounts();
  }

  private getParams() {
    return {
      startDate: this.dateFilterUtils.convertNgbDateToString(this.fromDate),
      endDate: this.dateFilterUtils.convertNgbDateToString(this.toDate),
      excludeAdminAndStaff: this.ExcludeAdminAndStaff
    };
  }

  /**
   * Loads the release file download counts for the given date range and excludeAdminAndStaff
   */
  loadReleaseFileDownloadCounts() {
    this.submitting = true;
    const params = this.getParams();

    this.releaseFileDownloadCountService.findReleaseFileDownloadCounts(params)
      .subscribe({
       next: data => {
          this.releaseFileDownloadCounts = data;
          this.sortData();
          this.submitting = false;
        },
        error: (error: any) => {
          console.error('Error loading release file download counts:', error);
          this.submitting = false;
        }
  });
  }

  onDateChange(dateType: 'from' | 'to', dateValue: NgbDate): void {
      if (!this.dateFilterUtils.isValidDate(dateValue)) {
        console.error(`${dateType} date is invalid`);
        return; 
      }
      this.loadReleaseFileDownloadCounts();
  }

  loadReleaseFileDownloadCountsCSV() {
    this.downloading = true;
    const params = this.getParams();

    this.releaseFileDownloadCountService.findReleaseFileDownloadCountsCSV(params)
      .subscribe({
       next: data => {
          this.downloadCSV(data);
          this.downloading = false;
        },
        error: (error: any) => {
          console.error('Error loading release file download details:', error);
          this.downloading = false;
        }
  });
  }

  //relese file download cound csv download function

  downloadCSV(data: any[]) {

    const header = [
      "Date (UTC)",
      "Time (UTC)",
      "Username",
      "Release Package",
      "Release Version",
      "Release File Name"
    ];

    const escapeCSVField = (field: string): string => {
      if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field || '';
    };
  
    const csvRows = data.map(item => {
      const [date, time] = item.auditEventDate.split('T');
      return [
        date,
        time.replace('Z', ''), 
        item.principal,
        escapeCSVField(item.data["releasePackage.name"] || ''),
        escapeCSVField(item.data["releaseVersion.name"] || ''),
        escapeCSVField(this.transformToPlainText(item.data["releaseFile.label"] || ''))
      ].join(','); 
    });
  
    const csvContent = [header.join(','), ...csvRows].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReleaseFileDownloadData.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }


  toggleField(field: string) {
    if (this.orderByField === field) {
      this.reverseSort = !this.reverseSort;
    } else {
      this.orderByField = field;
      this.reverseSort = false;
    }

    this.sortData();
  }

  transformToPlainText(richText: string): string {
    const div = document.createElement('div');
    div.innerHTML = richText;
    return (div.innerText || div.textContent || '').trim();
  }

  private sortData() {
    this.releaseFileDownloadCounts.sort((a: any, b: any) => {
      const compare = (fieldA: any, fieldB: any, isNumeric: boolean = false) => {
        if (!isNumeric) {
          fieldA = fieldA?.toLowerCase() || '';
          fieldB = fieldB?.toLowerCase() || '';
        }
        if (fieldA < fieldB) return -1;
        if (fieldA > fieldB) return 1;
        return 0;
      };

      if (this.orderByField === 'count') {
        let result = compare(b.count, a.count, true);

        if (result !== 0) return result;

        result = compare(a.releasePackageName, b.releasePackageName);
        if (result !== 0) return result;

        result = compare(a.releaseVersionName, b.releaseVersionName);
        if (result !== 0) return result;

        return compare(
          this.transformToPlainText(a.releaseFileName),
          this.transformToPlainText(b.releaseFileName)
        );
      }

      let fieldA = a[this.orderByField];
      let fieldB = b[this.orderByField];

      if (this.orderByField === 'releaseFileName') {
        fieldA = this.transformToPlainText(fieldA);
        fieldB = this.transformToPlainText(fieldB);
      }

      const primaryResult = compare(fieldA, fieldB);
      return this.reverseSort ? -primaryResult : primaryResult;
    });
  }
  
}