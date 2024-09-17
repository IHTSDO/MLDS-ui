import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { AuditsService } from 'src/app/services/audits/audits.service';
import { AuditsEmbedComponent } from '../../common/audits-embed/audits-embed.component';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';

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

  constructor(private activityLogsService: AuditsService) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.previousWeek();
    this.loadActivity();
  }

  /**
   * Loads activity logs for the given date range
   */
  loadActivity(): void {
    this.submitting = true;
    this.activityLogsService.findByDates(this.fromDate, this.toDate).subscribe(
      data => {
        this.audits = data;
        this.submitting = false;
      },
      error => {
        this.submitting = false;
        console.error(error);
      }
    );
  }

  /**
   * Called when the date range changes
   */
  onChangeDate(): void {
    this.loadActivity();
  }

  /**
   * Formats a moment object as a string in the format 'YYYY-MM-DD'
   * @param m - moment object
   * @returns formatted string
   */
  toDateFilter(m: moment.Moment): string {
    return m.format('YYYY-MM-DD');
  }

  /**
   * Sets the date range to today
   */
  today() {
    this.fromDate = this.toDateFilter(moment());
    this.toDate = this.toDateFilter(moment().add(1, 'days'));
  }

  /**
   * Sets the date range to the previous week
   */
  previousWeek() {
    this.fromDate = this.toDateFilter(moment().subtract(1, 'weeks'));
    this.toDate = this.toDateFilter(moment().add(1, 'days'));
  }

  /**
   * Sets the date range to the previous month
   */
  previousMonth() {
    this.fromDate = this.toDateFilter(moment().subtract(1, 'months'));
    this.toDate = this.toDateFilter(moment().add(1, 'days'));
  }
}