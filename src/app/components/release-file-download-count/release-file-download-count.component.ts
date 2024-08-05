import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { ReleaseFileDownloadCountService } from 'src/app/services/release-file-download-count/release-file-download-count.service';


@Component({
  selector: 'app-release-file-download-count',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './release-file-download-count.component.html',
  styleUrl: './release-file-download-count.component.scss'
})
export class ReleaseFileDownloadCountComponent implements OnInit {
  dropdownOpen = false;
  submitting = false;
  omitUsers: string[] = [];
  userList: string[] = [];
  fromDate: any | undefined;
  toDate: any | undefined;
  releaseFileDownloadCounts: any;

  constructor(private releaseFileDownloadCountService: ReleaseFileDownloadCountService) {}

  ngOnInit() {
    this.previousWeek(); // Set initial date range
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleUserSelection(user: string) {
    const index = this.omitUsers.indexOf(user);
    if (index === -1) {
      this.omitUsers.push(user);
    } else {
      this.omitUsers.splice(index, 1);
    }
  }

  isUserSelected(user: string): boolean {
    return this.omitUsers.includes(user);
  }


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

  toDateFilter(m: moment.Moment): string {
    return m.format('YYYY-MM-DD');
  }

  today() {
    this.fromDate = this.toDateFilter(moment());
    this.toDate = this.toDateFilter(moment().add(1, 'days'));
  }

  previousWeek() {
    this.fromDate = this.toDateFilter(moment().subtract(1, 'weeks'));
    this.toDate = this.toDateFilter(moment().add(1, 'days'));
  }

  previousMonth() {
    this.fromDate = this.toDateFilter(moment().subtract(1, 'months'));
    this.toDate = this.toDateFilter(moment().add(1, 'days'));
  }

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