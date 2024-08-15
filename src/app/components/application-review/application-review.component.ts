import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { ApplicationSummaryBlockComponent } from "../application-summary-block/application-summary-block.component";
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
@Component({
  selector: 'app-application-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApplicationSummaryBlockComponent],
  templateUrl: './application-review.component.html',
  styleUrl: './application-review.component.scss'
})
export class ApplicationReviewComponent implements OnInit{

  showNonMemberAlert: boolean = false;
  showNonPendingAlert: boolean = false;
  isAdmin: boolean = false;
  application: any = null;
  errorMessage: string | null = null;
  alerts: { type: string, msg: string }[] = [];
  commercialUsageInstitutionsByCountry: { [key: string]: any[] } = {};
  usageCountryCountslist: any[] = [];
  notesForm: FormGroup;
  isActionDisabled = true;
  isNoteReadOnly = true;
  submitting = false;
  comparisonAffiliate: any = null;
  showComparisonAffiliate = false;
  searchingAffiliates = false;
  searchResults: any[] = [];
  originalAffiliate: any;
  routes =ROUTES;  


  constructor(private router: Router,private route: ActivatedRoute, private userRegistrationService: UserRegistrationService, private fb: FormBuilder
    , private modalService: NgbModal, private affiliateService: AffiliateService, private authenticationService: AuthenticationSharedService
  )
  {
    this.notesForm = this.fb.group({
      notesInternal: [{ value: '', disabled: this.isNoteReadOnly }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadApplication();
  }

  private loadApplication(): void {
    this.route.paramMap.subscribe(params => {
      const applicationId = params.get('applicationId');
      if (applicationId) {
        this.fetchApplicationById(applicationId);
      }
    });

  }

  private fetchApplicationById(applicationId: string): void {
    this.userRegistrationService.getApplicationById(applicationId).subscribe(
      data => {
        this.application = data;
        this.processCommercialUsageData();
        this.loadNotes();
        this.setOriginalAffiliate(this.application.affiliate);
        this.alertChecking();
      },
      error => {
        this.errorMessage = 'Error retrieving application data';
        console.error(error);
      }
    );
  }

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
  }

  loadNotes(){
    if (this.application?.notesInternal) {
      this.notesForm.patchValue({
        notesInternal: this.application.notesInternal
      });
    }
  }

  setOriginalAffiliate(affiliate: any) {
    this.originalAffiliate = affiliate;
  }

  closeComparisonAffiliate(): void {
    this.comparisonAffiliate = null; 
  }

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
        console.log('Modal confirmed with result:', result);
        this.goToPendingApplication();
      })
    });   
  }

  //  change requested function
  changeRequested() {
    this.saveNotes();
    const modalRef = this.modalService.open(ChangeRequestedModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.application = this.application;
    console.log('Change requested from applicant');
    modalRef.result.then(
      (result) => {
        console.log('Modal confirmed with result:', result);
        this.goToPendingApplication();
      }
    );
  }

  // review request from staff function
  reviewRequested() {
    this.saveNotes();
    const modalRef = this.modalService.open(ReviewRequestedModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.application = this.application;
    console.log('Review requested from staff');
    modalRef.result.then(
      (result) => {
        console.log('Modal confirmed with result:', result);
        this.goToPendingApplication();
      }
    );
  }

  // reject application function
  rejectApplication() {
    this.saveNotes();
    const modalRef = this.modalService.open(RejectApplicationModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.application = this.application;
    console.log('Application declined');
    modalRef.result.then(
      (result) => {
        console.log('Modal confirmed with result:', result);
        this.goToPendingApplication();
      }
    );
  }

 
  goToPendingApplication(): void {
    this.router.navigate([this.routes.pendingApplications]);
  }

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
  

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.trim();
    if (term) {
      this.affiliateService.allAffiliates(term).subscribe(
        (response: any) => {
          const affiliates = Array.isArray(response.affiliates) ? response.affiliates : [];
          this.searchResults = affiliates.filter((a: any) =>
            this.originalAffiliate === null || a.affiliateId !== this.originalAffiliate.affiliateId
          );
          this.showComparisonAffiliate = this.searchResults.length > 0;
        },
        err => {
          console.error('Error fetching affiliates:', err);
          this.searchResults = [];
          this.showComparisonAffiliate = false;
        }
      );
    } else {
      this.searchResults = [];
      this.showComparisonAffiliate = false;
    }
  }

  selectAffiliate(affiliate: any): void {
    this.comparisonAffiliate = affiliate;
    this.showComparisonAffiliate = false;
    this.userRegistrationService.getApplicationById(this.comparisonAffiliate.application.applicationId).subscribe(
      data => {
        this.comparisonAffiliate = data;
      },
      error => {
        this.errorMessage = 'Error retrieving application data';
        console.error(error);
      })
  }

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}
