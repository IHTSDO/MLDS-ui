import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditsService } from 'src/app/services/audits/audits.service';
import { AuditsEmbedComponent } from '../../common/audits-embed/audits-embed.component';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { DateFilterUtilsService } from 'src/app/services/date-filter-utils/date-filter-utils.service';

/**
 * ActivityLogsComponent - displays activity logs for a given date range
 */
@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, AuditsEmbedComponent, CompareTextPipe,TranslateModule],
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
  fromDate!: string;

  /**
   * To date for filtering audits
   */
  toDate!: string;

  constructor(private activityLogsService: AuditsService, private dateFilterUtils: DateFilterUtilsService) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    const { fromDate, toDate } = this.dateFilterUtils.previousWeek();
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.loadActivity();
  }

  /**
   * Loads activity logs for the given date range
   */
  loadActivity(): void {
    this.submitting = true;
    this.activityLogsService.findByDates(this.fromDate, this.toDate).subscribe({
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
  
  /**
   * Called when the date range changes
   */
  onChangeDate(): void {
    this.loadActivity();
  }
}