import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditsService } from 'src/app/services/audits/audits.service';
import { AuditsEmbedComponent } from '../../common/audits-embed/audits-embed.component';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { DateFilterUtilsService } from 'src/app/services/date-filter-utils/date-filter-utils.service';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * ActivityLogsComponent - displays activity logs for a given date range
 */
@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, AuditsEmbedComponent, CompareTextPipe,TranslateModule,NgbDatepickerModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss'
})
export class ActivityLogsComponent implements OnInit {
  /**
   * Array of audit logs
   */
  audits: any[] = [];

  /**
   * Flag indicating whether the component is submitting a request
   */
  submitting = false;

  /**
   * From date for filtering audits
   */
  fromDate!: NgbDate;

  /**
   * To date for filtering audits
   */
  toDate!: NgbDate;

  constructor(private activityLogsService: AuditsService, private dateFilterUtils: DateFilterUtilsService) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    const { fromDate, toDate } = this.dateFilterUtils.previousWeek();
    this.fromDate = this.dateFilterUtils.convertToNgbDateStruct(fromDate);
    this.toDate = this.dateFilterUtils.convertToNgbDateStruct(toDate);
    this.loadActivity();
  }

  /**
   * Loads activity logs for the given date range
   */
  loadActivity(): void {
    this.submitting = true;
    this.activityLogsService.findByDates(this.dateFilterUtils.convertNgbDateToString(this.fromDate), this.dateFilterUtils.convertNgbDateToString(this.toDate)).subscribe({
      next: data => {
        this.audits = data;
        this.submitting = false;
      },
      error: error => {
        this.submitting = false;
        console.error(error);
      },
      complete: () => {
      }
    });
  }
  

  onDateChange(dateType: 'from' | 'to', dateValue: NgbDate): void {
    if (!this.dateFilterUtils.isValidDate(dateValue)) {
      console.error(`${dateType} date is invalid`);
      return; 
    }
    this.loadActivity();
  }
}