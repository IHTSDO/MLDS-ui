/**
 * Pending Applications Component
 * 
 * This component displays a list of pending applications, allowing users to view and manage them.
 * It also provides functionality to generate a CSV file of the applications and to load more applications as the user scrolls.
 * 
 * @example
 * <app-pending-applications></app-pending-applications>
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { FormsModule } from '@angular/forms';
import { PendingApplicationsService } from 'src/app/services/pending-applications/pending-application.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/routes-config'
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { ScrollTrackerDirective } from 'src/app/directives/scroll-tracker.directive';
/**
 * Pending Applications Component
 */
@Component({
    selector: 'app-pending-applications',
    imports: [ScrollTrackerDirective, CommonModule, FormsModule, TranslateModule, EnumPipe, CompareTextPipe],
    templateUrl: './pending-application.component.html',
    styleUrls: ['./pending-application.component.scss']
})
export class PendingApplicationsComponent implements OnInit {
  /**
   * List of pending applications
   */
  applications: any[] = [];

  /**
   * Flag indicating whether the CSV file is being generated
   */
  generatingCsv = false;

  /**
   * Search query to filter applications
   */
  query = '';

  /**
   * Flag to show all applications
   */

  showAllApplications: string = '0'; 

  /**
   * Home member name
   */
  homeMember: string = '';

  /**
   * Field to order applications by
   */
  orderByField = '';

  /**
   * Flag to reverse the sort order
   */
  reverseSort = false;

  /**
   * Flag indicating whether the user is an admin
   */
  isAdmin: boolean = false; // Set this based on actual logic


  page = 0;

  /**
   * Number of usage reports to display per page.
   */
  pageSize = 50;

  /**
   * Whether there are more usage reports to load.
   */
  hasMoreData = true;
  loadingApplications = true;
  routes=ROUTES;

  /**
   * Constructor
   * 
   * @param userRegistrationService Pending Applications Service
   */
  constructor(private userRegistrationService: PendingApplicationsService, private authenticationService: AuthenticationSharedService, private router: Router,private translateService:TranslateService) { }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    const userDetails = this.authenticationService.getUserDetails();
    this.isAdmin = this.authenticationService.isAdmin();
    this.homeMember = userDetails?.member?.['key'];
    this.loadApplications();
  }

/**
 * Loads the pending applications based on the provided query parameters.
 * 
 * @example
 * this.loadApplications();
 */


  loadApplications(reset = false): void {

    this.loadingApplications = true;
    const homeMember = this.showAllApplications == '0' ? this.homeMember : null;
    if (reset) {
      this.page = 0;
      this.applications = [];
      this.hasMoreData = true;
    }
    this.userRegistrationService
      .filterPendingApplications(this.query,this.page, this.pageSize, homeMember, this.orderByField, this.reverseSort)
      .subscribe({next:(response) => {
        if (response.length < this.pageSize) {
          this.hasMoreData = false;
        }
        this.applications = [...this.applications, ...response];
        this.page++;
        this.loadingApplications = false;
      },error: (error: any) => {
        console.error('Error fetching applications', error);
        this.loadingApplications = false;
      }});
}


 /**
 * Generates a CSV file of the pending applications.
 * 
 * The CSV file will contain the following columns:
 * - No.
 * - Affiliate Name
 * - Application Type
 * - Agreement Type
 * - Use Type
 * - Date Submitted
 * - Status
 * - Country
 * - Member
 * - Email
 * 
 * @example
 * this.generateCsv();
 */
  generateCsv(): void {
    this.generatingCsv = true;
    this.userRegistrationService
      .filterPendingApplications(this.query, 0, 999999999, this.showAllApplications === '1' ? null : this.homeMember, this.orderByField, this.reverseSort)
      .subscribe({
        next:(response) => {
          const expressions = [
            (application: any) => application.applicationId,
            (application: any) => application.affiliateDetails.firstName + ' ' + application.affiliateDetails.lastName,
            (application: any) => this.translateService.instant('application.applicationType.' + (application.applicationType??'')),



            
            (application: any, isPrimary: boolean) => {
              let agreementTypeKey = '';
            
              if (isPrimary) {
                agreementTypeKey = application.affiliateDetails?.agreementType 
                  ? 'affiliate.agreementType.' + application.affiliateDetails.agreementType 
                  : '';
              } else {
                agreementTypeKey = application.affiliate?.affiliateDetails?.agreementType 
                  ? 'affiliate.agreementType.' + application.affiliate.affiliateDetails.agreementType 
                  : '';
              }
            
              return agreementTypeKey ? this.translateService.instant(agreementTypeKey) : '';
            },
            
            
            (application: any, isPrimary: boolean) => {
              let typeKey = '';
              let subTypeKey = '';
            
              if (isPrimary) {
                typeKey = application.type ? 'affiliate.type.' + application.type : '';
                subTypeKey = application.subType ? 'affiliate.subType.' + application.subType : '';
              } else {
                typeKey = application.affiliate?.type ? 'affiliate.type.' + application.affiliate.type : '';
              }
            
              // Translate only if a valid key exists
              const translatedType = typeKey ? this.translateService.instant(typeKey) : '';
              const translatedSubType = subTypeKey ? this.translateService.instant(subTypeKey) : '';
            
              return isPrimary ? `${translatedType} - ${translatedSubType}` : translatedType;
            },
            
            (application: any) => application?.submittedAt ? new Date(application.submittedAt).toISOString().split('T')[0] : '',
            (application: any) => this.translateService.instant('approval.state.'+ (application.approvalState ?? '')),
            (application: any) => application?.affiliateDetails?.address?.country?.commonName || '',
            (application: any) => this.translateService.instant('global.member.'+ (application.member.key?? '')),
            (application: any) => application?.affiliateDetails?.email || ''
          ];

          const result = response.map((application: any) => {
            const isPrimary = application.applicationType === 'PRIMARY';
            return expressions.map((expression) => expression(application, isPrimary));
          });

          this.exportToCsv('pending-applications.csv', result, [
            'No.',
            'Affiliate Name',
            'Application Type',
            'Agreement Type',
            'Use Type',
            'Date Submitted',
            'Status',
            'Country',
            'Member',
            'Email',
          ]);
          this.generatingCsv = false;
        },
        error: (error: any) => {
          console.error('CSV generation failure: ', error);
          this.generatingCsv = false;
        }
  });
  }

 /**
 * Exports data to a CSV file
 * 
 * @param filename The name of the CSV file to be generated
 * @param rows The data to be exported
 * @param headers The headers for the CSV file
 * @example
 * exportToCsv('applications.csv', applications, ['Name', 'Email', 'Status']);
 */
exportToCsv(filename: string, rows: any[], headers: string[]): void {
  const csvContent =
    headers.join(',') +
    '\n' +
    rows.map((row) => row.map((field: any) => `"${field}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

/**
 * Transforms an enum value with a prefix
 * 
 * @param prefix The prefix to be added to the enum value
 * @param value The enum value to be transformed
 * @returns The transformed enum value
 * @example
 * enumTransform('PREFIX_', 'VALUE'); // Returns 'PREFIX_VALUE'
 */
enumTransform(prefix: string, value: string): string {
  // Implement your enum transformation logic here
  return `${prefix}${value}`;
}

/**
 * Navigates to an application
 * 
 * @param application The application to navigate to
 * @example
 * goToApplication(application);
 */
goToApplication(application: any): void {
  this.router.navigate([this.routes.applicationReview, encodeURIComponent(application.applicationId)]);
}

/**
 * Toggles the sort order of a field
 * 
 * @param field The field to toggle the sort order for
 * @example
 * toggleField('name');
 */
toggleField(field: string): void {
  if (this.orderByField === field) {
    this.reverseSort = !this.reverseSort;
  } else {
    this.orderByField = field;
    this.reverseSort = false;
  }
  this.loadApplications(true);
}

/**
 * Rejects an application
 * 
 * @param application The application to reject
 * @example
 * rejectApplication(application);
 */
rejectApplication(application: any): void {
  // Implement rejection logic
}
}