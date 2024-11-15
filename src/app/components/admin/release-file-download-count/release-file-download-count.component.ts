import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ReleaseFileDownloadCountService } from 'src/app/services/release-file-download-count/release-file-download-count.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { DateFilterUtilsService } from 'src/app/services/date-filter-utils/date-filter-utils.service';

/**
 * Release File Download Count component
 *
 * This component displays the release file download count for a given date range and allows users to filter by excluding specific users.
 */
@Component({
  selector: 'app-release-file-download-count',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CompareTextPipe],
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
  fromDate: any;

  /**
   * To date for the download count
   */
  toDate: any;

  /**
   * Release file download counts data
   */
  releaseFileDownloadCounts: any;

  usersLoading = false;

  constructor(private releaseFileDownloadCountService: ReleaseFileDownloadCountService, private dateFilterUtils: DateFilterUtilsService) {}

  /**
   * Initializes the component by setting the initial date range to the previous week
   */
  ngOnInit() {
    const { fromDate, toDate } = this.dateFilterUtils.previousMonth();
    this.fromDate = fromDate;
    this.toDate = toDate;
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
      .subscribe({
       next: data => {
          this.releaseFileDownloadCounts = data;
          this.loadUsers(this.fromDate, this.toDate);
        },
        error: (error: any) => {
          console.error('Error loading release file download counts:', error);
          this.submitting = false;
        }
  });
  }

  /**
   * Loads the list of users for the given date range
   *
   * @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   */
  loadUsers(fromDate: string, toDate: string) {
    this.usersLoading = true;
    this.releaseFileDownloadCountService.getUsers(fromDate, toDate)
      .subscribe({
        next:(data: string[]) => {
          this.usersLoading = false;
          this.submitting = false;
          this.userList = data; // Handle the list of usernames
        },
        error: (error: any)=> {
          this.usersLoading = false;
          this.submitting = false;
          console.error('Error loading users:', error);
        }
  });
  }
}