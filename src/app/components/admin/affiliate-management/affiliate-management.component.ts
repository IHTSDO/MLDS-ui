import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { SessionStateService } from 'src/app/services/session-state/session-state.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { saveAs } from 'file-saver';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { ScrollTrackerDirective } from 'src/app/directives/scroll-tracker.directive';

/**
 * Affiliate Management Component
 */
@Component({
  selector: 'app-affiliate-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, EnumPipe,TranslateModule,ScrollTrackerDirective],
  templateUrl: './affiliate-management.component.html',
  styleUrl: './affiliate-management.component.scss'
})
export class AffiliateManagementComponent implements OnInit {
  /**
   * Close alert function
   * @param _t44 never
   */
  closeAlert(_t44: never) {
    throw new Error('Method not implemented.');
  }

  /**
   * Affiliates array
   */
  affiliates: any[] = [];

  /**
   * Is admin flag
   */
  isAdmin = this.sessionService.isAdmin();

  /**
   * Download affiliates flag
   */
  downloadingAffiliates = false;

  /**
   * Page number
   */
  page = 0;

  /**
   * Can sort flag
   */
  canSort = true;

  /**
   * Standing state options
   */
  standingStateOptions = this.standingStateUtilsService.options();

  /**
   * Alerts array
   */
  alerts = [];

  /**
   * Generating CSV flag
   */
  generatingCsv = false;

  /**
   * Query string
   */
  query = '';

  /**
   * Show all affiliates flag
   */
  showAllAffiliates: string = '0';

  /**
   * Order by field
   */
  orderByField = 'standingState';

  /**
   * Reverse sort flag
   */
  reverseSort = false;

  /**
   * Standing state filter
   */
  standingStateFilter = '';

  /**
   * Standing state not applying flag
   */
  standingStateNotApplying = false;

  /**
   * Load reset flag
   */
  loadReset = false;

  /**
   * All retrieved flag
   */
  allRetrieved = false;

  /**
   * No results flag
   */
  noResults = true;

  /**
   * Total results
   */
  totalResults = 0;

  /**
   * Total pages
   */
  totalPages = 0;

  /**
   * Home member
   */
  homeMember: string = '';

  constructor(
    private router: Router,
    private affiliateService: AffiliateService,
    private sessionService: AuthenticationSharedService,
    private standingStateUtilsService: StandingStateUtilsService,
    private sessionStateService: SessionStateService
  ) {}

  /**
   * OnInit lifecycle hook
   */
  ngOnInit(): void {
    const userDetails = this.sessionService.getUserDetails();
    this.isAdmin = this.sessionService.isAdmin();
    this.homeMember = userDetails?.member?.['key'];
    this.showAllAffiliates = '0';
    this.loadVisualState();
    this.loadAffiliates();
  }

  /**
   * Load visual state
   */
  loadVisualState(): void {
    const store = this.sessionStateService.sessionState.affiliatesFilter;
    this.query = store.affiliateQuery || '';
    this.showAllAffiliates = store.showAllAffiliates || '0';
    this.orderByField = store.orderByField || 'standingState';
    this.reverseSort = store.reverseSort || false;
    this.standingStateFilter = store.standingStateFilter || null;
    this.standingStateNotApplying = store.standingStateNotApplying || false;
  }

  /**
   * Save visual state
   */
  saveVisualState(): void {
    const store = this.sessionStateService.sessionState.affiliatesFilter;
    store.affiliateQuery = this.query;
    store.showAllAffiliates = this.showAllAffiliates;
    store.orderByField = this.orderByField;
    store.reverseSort = this.reverseSort;
    store.standingStateFilter = this.standingStateFilter;
    store.standingStateNotApplying = this.standingStateNotApplying;
  }

  /**
   * Get member key
   * @returns member key
   */
  getMemberKey(){
    const userDetails = this.sessionService.getUserDetails();
    return userDetails?.member?.['key'];
  }
 /**
   * Load more affiliates
   */
 loadMoreAffiliates(): void {
  /**
   * Example usage:
   * this.loadMoreAffiliates();
   */
    let homeMemberKey =  this.homeMember;
    this.saveVisualState();

    if (this.downloadingAffiliates) {
      return;
    }

    if (this.allRetrieved) {
      return;
    }

    this.loadReset = false;
    this.downloadingAffiliates = true;
    this.alerts = [];
    this.affiliateService
      .filterAffiliates(
        this.query,
        this.page,
        this.showAllAffiliates == '0' ? homeMemberKey : null,
        this.standingStateFilter,
        this.standingStateNotApplying,
        this.orderByField,
        this.reverseSort
      )
      .subscribe({
        next: response => {
          response.affiliates.forEach((a: any) => {
            this.affiliates.push(a);
          });
          if (this.affiliates.length > 0) {
            this.noResults = false;
          }
          this.page += 1;
          this.downloadingAffiliates = false;
          this.totalResults = response.totalResults;
          this.totalPages = response.totalPages;
          if (this.affiliates.length >= this.totalResults) {
            this.allRetrieved = true;
          }
          if (this.loadReset) {
            this.loadAffiliates();
          }
        },
        error: error => {
          this.downloadingAffiliates = false;
          console.error('Error fetching applications', error);
          if (this.loadReset) {
            this.loadAffiliates();
          }
        },
        complete: () => {
          // Optional: You can handle the completion if needed
          console.log('Affiliate loading completed');
        }
      });
      
  }
loadMoreAffiliatess(): void {
  let homeMemberKey = this.homeMember;
  this.saveVisualState();

  // Prevent multiple simultaneous requests
  if (this.downloadingAffiliates || this.allRetrieved) {
    return;
  }

  this.loadReset = false;
  this.downloadingAffiliates = true;
  this.alerts = [];

  // Fetching affiliates
  this.affiliateService
    .filterAffiliates(
      this.query,
      this.page,
      this.showAllAffiliates === '0' ? homeMemberKey : null,
      this.standingStateFilter,
      this.standingStateNotApplying,
      this.orderByField,
      this.reverseSort
    )
    .subscribe({
      next: response => {
        // Add affiliates to the list
        response.affiliates.forEach((a: any) => {
          this.affiliates.push(a);
        });

        // Update state
        if (this.affiliates.length > 0) {
          this.noResults = false;
        }
        this.page += 1;
        this.downloadingAffiliates = false;
        this.totalResults = response.totalResults;
        this.totalPages = response.totalPages;

        // Check if all affiliates are retrieved
        if (this.affiliates.length >= this.totalResults) {
          this.allRetrieved = true;
        }

        // Reset loading if applicable
        if (this.loadReset) {
          this.loadAffiliates();
        }
      },
      error: error => {
        this.downloadingAffiliates = false;
        console.error('Error fetching applications', error);
        if (this.loadReset) {
          this.loadAffiliates();
        }
      },
      complete: () => {
        console.log('Affiliate loading completed');
      }
    });
}

/**
 * Load affiliates
 *
 * Resets the affiliate list and loads the first page of affiliates based on the current query and filters.
 *
 * Example usage:
 * this.loadAffiliates();
 */
  loadAffiliates(): void {
    this.affiliates = [];
    this.page = 0;
    this.totalPages = 0;
    this.totalResults = 50;
    this.allRetrieved = false;
    this.noResults = true;
    this.canSort = !this.query;
    this.loadReset = true;
    this.loadMoreAffiliates();
  }
/**
 * Changed select option
 *
 * Handles changes to the "Show all affiliates" select option and reloads the affiliate list accordingly.
 *
 * @param event The select option change event
 *
 * Example usage:
 * this.changedSelectOption(event);
 */
  changedSelectOption(event: any): void{
    this.showAllAffiliates = event;
    this.loadAffiliates();
  }
/**
 * Clear search
 *
 * Clears the search query and reloads the affiliate list.
 *
 * Example usage:
 * this.clearSearch();
 */
  clearSearch(): void {
    this.standingStateFilter = '';
    this.query = '';
    this.loadAffiliates();
  }

/**
 * Toggle field
 *
 * Toggles the sort order of the affiliate list based on the specified field.
 *
 * @param fieldName The field to sort by
 * @param isDescendingOrder Optional: Whether to sort in descending order
 *
 * Example usage:
 * this.toggleField('affiliateName');
 */
  toggleField(fieldName: string, isDescendingOrder?: boolean): void {
    if (this.orderByField !== fieldName) {
      this.reverseSort = false;
    } else {
      this.reverseSort = !this.reverseSort;
    }

    if (typeof isDescendingOrder !== 'undefined') {
      this.reverseSort = isDescendingOrder;
    }

    this.orderByField = fieldName;
    this.loadAffiliates();
  }
/**
 * Filter standing state
 *
 * Filters the affiliate list by the specified standing state.
 *
 * @param state The standing state to filter by
 *
 * Example usage:
 * this.filterStandingState('APPROVED');
 */
  filterStandingState(state: string): void {
    this.standingStateFilter = state;
    this.standingStateNotApplying = false;
    this.loadAffiliates();
  }
/**
 * Filter standing state not applying
 *
 * Filters the affiliate list by affiliates that are not applying.
 *
 * Example usage:
 * this.filterStandingStateNotApplying();
 */
  filterStandingStateNotApplying(): void {
    this.standingStateFilter = 'APPLYING';
    this.standingStateNotApplying = true;
    this.loadAffiliates();
  }

/**
 * Next page
 *
 * Loads the next page of affiliates.
 *
 * Example usage:
 * this.nextPage();
 */
  nextPage(): void {
    this.loadMoreAffiliates();
  }
/**
 * Affiliate active details
 *
 * Returns the active details of an affiliate.
 *
 * @param affiliate The affiliate object
 *
 * Example usage:
 * const affiliateDetails = this.affiliateActiveDetails(affiliate);
 */
  affiliateActiveDetails(affiliate: any): any {
    return (
      affiliate.affiliateDetails ||
      (affiliate.application?.affiliateDetails) ||
      {}
    );
  }
/**
 * View affiliate
 *
 * Navigates to the affiliate details page for the specified affiliate ID.
 *
 * @param affiliateId The affiliate ID
 *
 * Example usage:
 * this.viewAffiliate('affiliate-123');
 */
  viewAffiliate(affiliateId: string): void {
    this.router.navigate(['/affiliateManagement', affiliateId]);
  }
  /**
 * Generate CSV
 *
 * Generates a CSV file containing the affiliate list based on the current query and filters.
 *
 * Example usage:
 * this.generateCsv();
 */
  generateCsv(): void {
    this.generatingCsv = true;
  
    this.affiliateService
      .generateCsv(
        this.query,
        0,
        this.showAllAffiliates === '1' ? null : this.homeMember,
        this.standingStateFilter,
        this.standingStateNotApplying,
        this.orderByField,
        this.reverseSort
      )
      .subscribe({
        next: (response: any) => {
          const csvData = this.buildCsvData(response.affiliates);
          this.exportToCsv('affiliates.csv', csvData, this.getCsvHeaders());
          this.generatingCsv = false;
        },
        error: (error: any) => {
          this.generatingCsv = false;
          console.error('Error fetching affiliates', error);
        }
      });
  }
  
  private buildCsvData(affiliates: any[]): any[] {
    return affiliates.map((affiliate) => this.buildCsvRow(affiliate));
  }
  
  private buildCsvRow(affiliate: any): any[] {
    const affiliateDetails = this.affiliateActiveDetails(affiliate);
    return [
      affiliate.affiliateId,
      `${affiliateDetails.firstName} ${affiliateDetails.lastName}`,
      affiliateDetails.organizationName || '',
      affiliateDetails.organizationType || '',
      `${affiliateDetails.type || ''} - ${affiliateDetails.subType || ''} ${affiliateDetails.otherText || ''}`,
      affiliate.standingState || '',
      affiliateDetails.address.country.commonName || '',
      affiliate.homeMember.key || '',
      affiliateDetails.email || '',
      affiliateDetails.billingAddress?.street || '',
      affiliateDetails.billingAddress?.city || '',
      affiliateDetails.billingAddress?.post || '',
      affiliate.application?.submittedAt || '',
      affiliate.application?.completedAt || '',
      affiliateDetails.agreementType || ''
    ];
  }
  
  private getCsvHeaders(): string[] {
    return [
      'Affiliate ID',
      'Affiliate Name',
      'Organization Name',
      'Organization Type',
      'Use Type',
      'Standing State',
      'Country',
      'Member',
      'Email',
      'Billing Street',
      'Billing City',
      'Billing Post',
      'Submitted At',
      'Completed At',
      'Agreement Type'
    ];
  }
   
/**
 * Export to CSV
 *
 * Exports data to a CSV file.
 *
 * @param filename The name of the CSV file to be generated
 * @param rows The data to be exported
 * @param headers The headers for the CSV file
 *
 * Example usage:
 * this.exportToCsv('affiliates.csv', rows, headers);
 */
exportToCsv(filename: string, rows: any[], headers: string[]): void {
  const csvContent =
    headers.join(',') +
    '\n' +
    rows.map((row) => row.map((field: any) => `"${field}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}
  
}