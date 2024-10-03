import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { ApplicationSummaryBlockComponent } from "../../common/application-summary-block/application-summary-block.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ApproveApplicationModalComponent } from '../approve-application-modal/approve-application-modal.component';
import { ApproveApplicationConfirmationModalComponent } from '../approve-application-confirmation-modal/approve-application-confirmation-modal.component';
import { ChangeRequestedModalComponent } from '../change-requested-modal/change-requested-modal.component';
import { ReviewRequestedModalComponent } from '../review-requested-modal/review-requested-modal.component';
import { RejectApplicationModalComponent } from '../reject-application-modal/reject-application-modal.component';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';
/**
 * ApplicationReviewComponent is a standalone Angular component that displays the details of an application and allows the user to approve, reject, or request changes to the application.
 *
 * @example
 * <app-application-review [application]="application"></app-application-review>
 */
@Component({
  selector: 'app-application-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApplicationSummaryBlockComponent, EnumPipe, CompareTextPipe,TranslateModule],
  templateUrl: './application-review.component.html',
  styleUrl: './application-review.component.scss'
})
export class ApplicationReviewComponent implements OnInit {
  /**
   * Whether to show a non-member alert
   *
   * @type {boolean}
   * @default false
   */
  showNonMemberAlert: boolean = false;

  /**
   * Whether to show a non-pending alert
   *
   * @type {boolean}
   * @default false
   */
  showNonPendingAlert: boolean = false;

  /**
   * Whether the user is an admin
   *
   * @type {boolean}
   * @default false
   */
  isAdmin: boolean = false;

  /**
   * The application being reviewed
   *
   * @type {any}
   * @default null
   */
  application: any = null;

  /**
   * Error message to display
   *
   * @type {string | null}
   * @default null
   */
  errorMessage: string | null = null;

  /**
   * Alerts to display
   *
   * @type {{ type: string, msg: string }[]}
   * @default []
   */
  alerts: { type: string, msg: string }[] = [];

  /**
   * Commercial usage institutions by country
   *
   * @type {{ [key: string]: any[] }}
   * @default {}
   */
  commercialUsageInstitutionsByCountry: { [key: string]: any[] } = {};

  /**
   * Usage country counts list
   *
   * @type {any[]}
   * @default []
   */
  usageCountryCountslist: any[] = [];

  /**
   * Notes form
   *
   * @type {FormGroup}
   */
  notesForm: FormGroup;

  /**
   * Whether the action is disabled
   *
   * @type {boolean}
   * @default true
   */
  isActionDisabled: boolean = true;

  /**
   * Whether the note is read-only
   *
   * @type {boolean}
   * @default true
   */
  isNoteReadOnly: boolean = true;

  /**
   * Whether the submission is in progress
   *
   * @type {boolean}
   * @default false
   */
  submitting: boolean = false;

  /**
   * Comparison affiliate
   *
   * @type {any}
   * @default null
   */
  comparisonAffiliate: any = null;

  /**
   * Whether to show the comparison affiliate
   *
   * @type {boolean}
   * @default false
   */
  showComparisonAffiliate: boolean = false;

  /**
   * Whether the affiliate search is in progress
   *
   * @type {boolean}
   * @default false
   */
  searchingAffiliates: boolean = false;

  /**
   * Search results
   *
   * @type {any[]}
   * @default []
   */
  searchResults: any[] = [];

  /**
   * Original affiliate
   *
   * @type {any}
   */
  originalAffiliate: any;

  /**
   * Routes configuration
   *
   * @type {any}
   */
  routes = ROUTES;

  /**
   * Constructor
   *
   * @param {Router} router Angular router
   * @param {ActivatedRoute} route Angular route
   * @param {UserRegistrationService} userRegistrationService User registration service
   * @param {FormBuilder} fb Form builder
   * @param {NgbModal} modalService Modal service
   * @param {AffiliateService} affiliateService Affiliate service
   * @param {AuthenticationSharedService} authenticationService Authentication shared service
   */
  constructor(private router: Router, private route: ActivatedRoute, private userRegistrationService: UserRegistrationService, private fb: FormBuilder,
    private modalService: NgbModal, private affiliateService: AffiliateService, private authenticationService: AuthenticationSharedService) {
    this.notesForm = this.fb.group({
      notesInternal: [{ value: '', disabled: this.isNoteReadOnly }, Validators.required]
    });
  }

  /**
 * Initialize the component
 *
 * Loads the application data when the component is initialized
 */
ngOnInit(): void {
  this.loadApplication();
}

/**
 * Load the application data
 *
 * Subscribes to the route parameter map to get the application ID and fetches the application data
 *
 * @private
 */
private loadApplication(): void {
  this.route.paramMap.subscribe(params => {
    const applicationId = params.get('applicationId');
    if (applicationId) {
      this.fetchApplicationById(applicationId);
    }
  });
}

/**
 * Fetch the application data by ID
 *
 * Calls the user registration service to get the application data and processes the response
 *
 * @param {string} applicationId The ID of the application to fetch
 *
 * @private
 */
private fetchApplicationById(applicationId: string): void {
  this.userRegistrationService.getApplicationById(applicationId).subscribe({
    /**
     * Handle the successful response
     *
     * @param {any} data The application data
     */
    next:data => {
      this.application = data;
      this.processCommercialUsageData();
      this.loadNotes();
      this.setOriginalAffiliate(this.application.affiliate);
      this.alertChecking();
    },
    /**
     * Handle the error response
     *
     * @param {any} error The error object
     */
    error: (error: any) => {
      this.errorMessage = 'Error retrieving application data';
      console.error(error);
    }
  });
}

/**
 * Check for alerts and permissions
 *
 * Checks if the user is an admin or if the user is a member of the application, and sets flags accordingly
 */
alertChecking(){
  const userDetails = this.authenticationService.getUserDetails();
  this.isAdmin = this.authenticationService.isAdmin();
  if(this.isAdmin || (userDetails?.member?.['key'] === this.application.member.key)){
    this.showNonMemberAlert = false;
    this.isNoteReadOnly = false;
    this.isActionDisabled = false;
  }
  else{
    this.showNonMemberAlert = true;
  }
  if(this.application.approvalState === "CHANGE_REQUESTED"){
    this.showNonPendingAlert = true;
  }
  this.updateNotesControlState();
}

private updateNotesControlState() {
  const notesControl = this.notesForm.get('notesInternal');
  if (this.isNoteReadOnly) {
    notesControl?.disable();
  } else {
    notesControl?.enable();
  }
}

/**
 * Load notes from the application
 *
 * If the application has notes, patch the notes form with the existing notes
 */
loadNotes(){
  if (this.application?.notesInternal) {
    this.notesForm.patchValue({
      notesInternal: this.application.notesInternal
    });
  }
}

/**
 * Set the original affiliate
 *
 * @param {any} affiliate The original affiliate to set
 */
setOriginalAffiliate(affiliate: any) {
  this.originalAffiliate = affiliate;
}

/**
 * Close the comparison affiliate
 */
closeComparisonAffiliate(): void {
  this.comparisonAffiliate = null; 
}

/**
 * Save notes to the application
 *
 * If the notes form is valid, update the application notes and handle any errors
 */
saveNotes() {
  if (!this.notesForm.invalid) {
    this.alerts = [];
    this.submitting = true;

    this.application.notesInternal = this.notesForm.get('notesInternal')?.value;
    this.userRegistrationService.updateApplicationNoteInternal(this.application)
      .pipe(
        finalize(() => this.submitting = false),
        catchError(() => {
          this.alerts.push({
            type: 'danger',
            msg: 'Network request failure [3]: please try again later.'
          });
          return of();
        })
      )
      .subscribe();
  }
}
  // approve application function
  approveApplication() {
    this.saveNotes();
    const modalRef = this.modalService.open(ApproveApplicationModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.application = this.application;

    modalRef.result.then(() => {
      const confirmationModalRef = this.modalService.open(ApproveApplicationConfirmationModalComponent, { backdrop: 'static' });
      confirmationModalRef.componentInstance.application = this.application;

      confirmationModalRef.result.then((result) => {
        this.goToPendingApplication();
      })
    });   
  }

/**
 * Change requested function
 *
 * Saves notes and opens a modal to confirm the change request
 */
changeRequested() {
  this.saveNotes();
  const modalRef = this.modalService.open(ChangeRequestedModalComponent, { backdrop: 'static' });
  modalRef.componentInstance.application = this.application;
  modalRef.result.then(
    (result) => {
      this.goToPendingApplication();
    }
  );
}

/**
 * Review request from staff function
 *
 * Saves notes and opens a modal to confirm the review request
 */
reviewRequested() {
  this.saveNotes();
  const modalRef = this.modalService.open(ReviewRequestedModalComponent, { backdrop: 'static' });
  modalRef.componentInstance.application = this.application;
  modalRef.result.then(
    (result) => {
      this.goToPendingApplication();
    }
  );
}

/**
 * Reject application function
 *
 * Saves notes and opens a modal to confirm the rejection
 */
rejectApplication() {
  this.saveNotes();
  const modalRef = this.modalService.open(RejectApplicationModalComponent, { backdrop: 'static' });
  modalRef.componentInstance.application = this.application;
  modalRef.result.then(
    (result) => {
      this.goToPendingApplication();
    }
  );
}

/**
 * Go to pending application
 *
 * Navigates to the pending applications route
 */
goToPendingApplication(): void {
  this.router.navigate([this.routes.pendingApplications]);
}

/**
 * Process commercial usage data
 *
 * Groups commercial usage data by country and sorts institutions by name
 */
private processCommercialUsageData(): void {
  if (this.application?.commercialUsage) {
    this.commercialUsageInstitutionsByCountry = this.groupBy(
      this.application.commercialUsage.entries,
      (entry: { country: { isoCode2: string } }) => entry.country.isoCode2
    );

    for (const key in this.commercialUsageInstitutionsByCountry) {
      if (this.commercialUsageInstitutionsByCountry.hasOwnProperty(key)) {
        this.commercialUsageInstitutionsByCountry[key].sort((a: { name: string }, b: { name: string }) => 
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
      }
    }

    this.usageCountryCountslist = this.application.commercialUsage.countries.slice().sort(
      (a: { country: { commonName: string } }, b: { country: { commonName: string } }) =>
        a.country.commonName.toLowerCase().localeCompare(b.country.commonName.toLowerCase())
    );
  }
}

/**
 * Group by function
 *
 * Groups an array by a key function
 *
 * @param {any[]} array The array to group
 * @param {(item: any) => string} key The key function
 * @returns {{ [key: string]: any[] }} The grouped array
 */
private groupBy(array: any[], key: (item: any) => string): { [key: string]: any[] } {
  return array.reduce((result: { [key: string]: any[] }, item) => {
    const groupKey = key(item);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * On search event
 *
 * Handles the search event and fetches affiliates
 *
 * @param {Event} event The search event
 */
onSearch(event: Event): void {
  const input = event.target as HTMLInputElement;
  const term = input.value.trim();
  if (term) {
    this.affiliateService.allAffiliates(term).subscribe({
      next:(response: any) => {
        const affiliates = Array.isArray(response.affiliates) ? response.affiliates : [];
        this.searchResults = affiliates.filter((a: any) =>
          this.originalAffiliate === null || a.affiliateId !== this.originalAffiliate.affiliateId
        );
        this.showComparisonAffiliate = this.searchResults.length > 0;
      },
      error: (error: any) => {
        console.error('Error fetching affiliates:', error);
        this.searchResults = [];
        this.showComparisonAffiliate = false;
      }
  });
  } else {
    this.searchResults = [];
    this.showComparisonAffiliate = false;
  }
}

/**
 * Select affiliate
 *
 * Selects an affiliate and fetches its application data
 *
 * @param {any} affiliate The selected affiliate
 */
selectAffiliate(affiliate: any): void {
  /**
   * Set the comparison affiliate and hide the comparison affiliate list
   */
  this.comparisonAffiliate = affiliate;
  this.showComparisonAffiliate = false;

  /**
   * Fetch the application data for the selected affiliate
   */
  this.userRegistrationService.getApplicationById(this.comparisonAffiliate.application.applicationId).subscribe({
    /**
     * On success, update the comparison affiliate with the fetched data
     *
     * @param {any} data The fetched application data
     */
   next: (data: any) => {
      this.comparisonAffiliate = data;
    },
    /**
     * On error, display an error message and log the error
     *
     * @param {any} error The error object
     */
    error: (error: any) => {
      this.errorMessage = 'Error retrieving application data';
      console.error(error);
    }
});
}

/**
 * Close alert
 *
 * Closes an alert by removing it from the alerts array
 *
 * @param {{ type: string, msg: string }} alert The alert to close
 */
closeAlert(alert: { type: string, msg: string }) {
  this.alerts = this.alerts.filter(a => a !== alert);
}

}
