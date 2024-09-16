import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { ReleaseFileDownloadCountService } from 'src/app/services/release-file-download-count/release-file-download-count.service';

/**
 * Release File Download Count component
 *
 * This component displays the release file download count for a given date range and allows users to filter by excluding specific users.
 */
@Component({
  selector: 'app-release-file-download-count',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './release-file-download-count.component.html',
  styleUrl: './release-file-download-count.component.scss'
})
export class ReleaseFileDownloadCountComponent implements OnInit {
  /**
   * Whether the dropdown menu is open
   */
  dropdownOpen = false;

  /**
   * Whether the component is submitting a request
   */
  submitting = false;

  /**
   * List of users to omit from the download count
   */
  omitUsers: string[] = [];

  /**
   * List of all users
   */
  userList: string[] = [];

  /**
   * From date for the download count
   */
  fromDate: any | undefined;

  /**
   * To date for the download count
   */
  toDate: any | undefined;

  /**
   * Release file download counts data
   */
  releaseFileDownloadCounts: any;

  constructor(private releaseFileDownloadCountService: ReleaseFileDownloadCountService) {}

  /**
   * Initializes the component by setting the initial date range to the previous week
   */
  ngOnInit() {
    this.previousWeek(); // Set initial date range
  }

  /**
   * Toggles the dropdown menu
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Toggles the selection of a user to omit from the download count
   *
   * @param user - The user to toggle
   */
  toggleUserSelection(user: string) {
    const index = this.omitUsers.indexOf(user);
    if (index === -1) {
      this.omitUsers.push(user);
    } else {
      this.omitUsers.splice(index, 1);
    }
  }

  /**
   * Checks if a user is selected to be omitted from the download count
   *
   * @param user - The user to check
   * @returns Whether the user is selected
   */
  isUserSelected(user: string): boolean {
    return this.omitUsers.includes(user);
  }

  /**
   * Loads the release file download counts for the given date range and excluded users
   */
  loadReleaseFileDownloadCounts() {
    this.submitting = true;
    const params = {
      startDate: this.fromDate,
      endDate: this.toDate,
      excludeUsers: this.omitUsers
    };

    this.releaseFileDownloadCountService.findReleaseFileDownloadCounts(params)
      .subscribe(
        data => {
          this.releaseFileDownloadCounts = data;
          this.loadUsers(this.fromDate!, this.toDate!);
          this.submitting = false;
        },
        error => {
          console.error('Error loading release file download counts:', error);
          this.submitting = false;
        }
      );
  }

  /**
   * Formats a moment object as a string in the format 'YYYY-MM-DD'
   *
   * @param m - The moment object to format
   * @returns The formatted string
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

  /**
   * Loads the list of users for the given date range
   *
   * @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   */
  loadUsers(fromDate: string, toDate: string) {
    this.releaseFileDownloadCountService.getUsers(fromDate, toDate)
      .subscribe(
        (data: string[]) => {
          this.userList = data; // Handle the list of usernames
        },
        error => {
          console.error('Error loading users:', error);
        }
      );
  }
}