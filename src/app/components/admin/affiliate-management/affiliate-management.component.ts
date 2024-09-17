import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { SessionStateService } from 'src/app/services/session-state/session-state.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { saveAs } from 'file-saver';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';

/**
 * Affiliate Management Component
 */
@Component({
  selector: 'app-affiliate-management',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule, FormsModule, NgbModule, EnumPipe,TranslateModule],
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
    var homeMemberKey =  this.homeMember;
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
        50,
        this.showAllAffiliates == '0' ? homeMemberKey : null,
        this.standingStateFilter,
        this.standingStateNotApplying,
        this.orderByField,
        this.reverseSort
      )
      .subscribe(
        response => {
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
        error => {
          this.downloadingAffiliates = false;
          console.error('Error fetching applications', error);
          if (this.loadReset) {
            this.loadAffiliates();
          }
        }
      );
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
      (affiliate.application && affiliate.application.affiliateDetails) ||
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
      .filterAffiliates(
        this.query,
        0,
        999999999,
        this.showAllAffiliates === '1' ? null : this.homeMember,
        this.standingStateFilter,
        this.standingStateNotApplying,
        this.orderByField,
        this.reverseSort
      )
      .subscribe(
        response => {
          const expressions = [
            (affiliate: any) => affiliate.affiliateId,
            (affiliate: any) => `${this.affiliateActiveDetails(affiliate).firstName} ${this.affiliateActiveDetails(affiliate).lastName}`,
            (affiliate: any) => this.affiliateActiveDetails(affiliate).organizationName || '',
            (affiliate: any) => this.affiliateActiveDetails(affiliate).organizationType || '',
            (affiliate: any) => `${this.affiliateActiveDetails(affiliate).type || ''} - ${this.affiliateActiveDetails(affiliate).subType || ''} ${this.affiliateActiveDetails(affiliate).otherText || ''}`,
            (affiliate: any) => affiliate.standingState || '',
            (affiliate: any) => this.affiliateActiveDetails(affiliate).address.country.commonName || '',
            (affiliate: any) => affiliate.homeMember.key || '',
            (affiliate: any) => this.affiliateActiveDetails(affiliate).email || '',
            (affiliate: any) => (this.affiliateActiveDetails(affiliate).billingAddress?.street || ''),
            (affiliate: any) => (this.affiliateActiveDetails(affiliate).billingAddress?.city || ''),
            (affiliate: any) => (this.affiliateActiveDetails(affiliate).billingAddress?.post || ''),
            (affiliate: any) => (affiliate.application?.submittedAt || ''),
            (affiliate: any) => (affiliate.application?.completedAt || ''),
            (affiliate: any) => this.affiliateActiveDetails(affiliate).agreementType || ''
          ];
  
          const result = response.affiliates.map((affiliate: any) => {
            return expressions.map((expression) => expression(affiliate));
          });
  
          this.exportToCsv('affiliates.csv', result, [
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
          ]);
          this.generatingCsv = false;
        },
        error => {
          this.generatingCsv = false;
          console.error('Error fetching affiliates', error);
          // Handle the error appropriately
        }
      );
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