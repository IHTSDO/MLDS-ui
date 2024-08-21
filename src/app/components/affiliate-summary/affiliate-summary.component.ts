import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { AffiliateDetailsSummaryComponent } from "../affiliate-details-summary/affiliate-details-summary.component";
import { ROUTES } from 'src/app/routes-config';
import { ActivityLogsComponent } from "../activity-logs/activity-logs.component";
import { AuditsEmbedComponent } from "../audits-embed/audits-embed.component";
import { AuditsService } from 'src/app/services/audits/audits.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { OrderByPipe } from 'src/app/pipes/order-by/order-by.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceSentModalComponent } from '../invoice-sent-modal/invoice-sent-modal.component';
import { DeleteAffiliateModalComponent } from '../delete-affiliate-modal/delete-affiliate-modal.component';
import { UsageReportsTableComponent } from "../usage-reports-table/usage-reports-table.component";
import { CreateLoginModalComponent } from '../create-login-modal/create-login-modal.component';
import { ApplicationSummaryModalComponent } from '../application-summary-modal/application-summary-modal.component';

@Component({
  selector: 'app-affiliate-summary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AffiliateDetailsSummaryComponent, ActivityLogsComponent, AuditsEmbedComponent, OrderByPipe, UsageReportsTableComponent],
  templateUrl: './affiliate-summary.component.html',
  styleUrl: './affiliate-summary.component.scss'
})
export class AffiliateSummaryComponent implements OnInit {

  affiliate: any = null;
  loading: boolean = true;
  approved: boolean = false;
  isEditable: boolean = false;
  isAdmin: boolean = false;
  submitting: boolean = false;
  notesForm: FormGroup;
  alerts: any[] = [];
  routes = ROUTES;
  audits: any[] = [];


  constructor(private router: Router, private route: ActivatedRoute, private affiliateService: AffiliateService, private authenticationService: AuthenticationSharedService,
    private fb: FormBuilder, private auditsService: AuditsService, public standingStateUtilsService: StandingStateUtilsService, public applicationUtilsService: ApplicationUtilsService,
    private modalService: NgbModal
  ) {
    this.notesForm = this.fb.group({
      notesInternal: [{ value: '', disabled: this.isEditable }, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.isAdmin = this.authenticationService.isAdmin();
    }
    this.loadAffiliate();
  }

  private loadAffiliate(): void {
    this.route.paramMap.subscribe(params => {
      const affiliateId = params.get('affiliateId');
      if (affiliateId) {
        this.fetchAffiliateById(affiliateId);
      }
    });
  }

  private fetchAffiliateById(affiliateId: string): void {
    this.affiliateService.affiliate(affiliateId).subscribe({
      next: data => {
        this.affiliate = data;
        this.loading = false;
        const userDetails = this.authenticationService.getUserDetails();
        this.isEditable = this.isAdmin || (userDetails?.member?.['key'] === this.affiliate.application.member.key);
        this.notesForm.setValue({
          notesInternal: this.affiliate.notesInternal || ''
        });
        this.loadAffiliateAudits(data.affiliateId);
      },
      error: error => {
        this.loading = true;
      }
    });

  }

  goToAffiliateManagement(): void {
    this.router.navigate([this.routes.affiliateManagement]);
  }

  saveNotes() {
    if (!this.notesForm.invalid) {
      this.alerts = [];
      this.submitting = true;
      this.affiliate.notesInternal = this.notesForm.get('notesInternal')?.value;
      this.affiliateService.updateAffiliate(this.affiliate)
        .pipe(
          finalize(() => {
            this.loadAffiliate();
            this.submitting = false
          }),
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

  isApplicationApproved(application: any): boolean {
    return this.applicationUtilsService.isApplicationApproved(application);
  }

  isApplicationPending(application: any): boolean {
    return this.applicationUtilsService.isApplicationPending(application);
  }

  isApplicationWaitingForApplicant(application: any): boolean {
    return this.applicationUtilsService.isApplicationWaitingForApplicant(application);
  }

  loadAffiliateAudits(affiliateId: string): void {
    this.auditsService.findByAffiliateId(affiliateId).subscribe({
      next: (result) => {
        this.audits = result;
      },
      error: (error: HttpErrorResponse) => {
        this.alerts.push({
          type: 'danger',
          msg: 'Network request failure [47] retrieving audit logs, please try again later.'
        });
        console.error('Failed to update audit list:', error.message);
      }
    });
  }

  invoiceSent(): void {
    const modalRef = this.modalService.open(InvoiceSentModalComponent);
    modalRef.componentInstance.affiliate = this.affiliate;

    modalRef.result.then((result) => {
      if (result) {
        this.affiliate.standingState = 'INVOICE_SENT';
        this.saveNotes();
      }
    });
  }

  deleteAffiliate(): void {
    const modalRef = this.modalService.open(DeleteAffiliateModalComponent);
    modalRef.componentInstance.affiliate = this.affiliate;

    modalRef.result.then(
      () => {
        this.router.navigate(['/affiliateManagement']);
      }
    );
  }

  viewApplication(application: any): void {
    const modalRef = this.modalService.open(ApplicationSummaryModalComponent, { size: 'lg' });
    modalRef.componentInstance.application = application;
  }

  approveApplication(application: any): void {
    this.router.navigate(['/applicationReview', application.applicationId]);
  }


  createLogin(): void {
    if (!this.affiliate.affiliateDetails.email) {
      console.error('No email!');
      this.openCreateLoginModal({ noEmail: 'true' });
      return;
    }


    this.requestLoginCreation();
  }

  requestLoginCreation() {
    this.affiliateService.createLogin(this.affiliate).subscribe({
      next: (result) => {
        this.alerts.push({ type: 'success', msg: 'Login has been successfully created for user.' });
        this.loadAffiliate();
      },
      error: (error) => {
        this.openCreateLoginModal({ duplicateEmail: 'true' });
      }
    });
  }


  openCreateLoginModal(reason: { noEmail?: string; duplicateEmail?: string }) {
    const modalRef = this.modalService.open(CreateLoginModalComponent);
    modalRef.componentInstance.affiliate = this.affiliate;
    modalRef.componentInstance.reason = reason;

    modalRef.result.then(() => {
      this.requestLoginCreation();
    });
  }

}
