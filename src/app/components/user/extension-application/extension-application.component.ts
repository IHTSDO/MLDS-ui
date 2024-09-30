import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { MemberService } from 'src/app/services/member/member.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { DeleteExtensionApplicationComponent } from '../delete-extension-application/delete-extension-application.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';

@Component({
  selector: 'app-extension-application',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NgbAlert,TranslateModule,CompareTextPipe],
  templateUrl: './extension-application.component.html',
  styleUrl: './extension-application.component.scss'
})
export class ExtensionApplicationComponent implements OnInit {
  extensionForm: any = {};
  readOnly = false;
  isApplicationWaitingForApplicant = false;
  isApplicationRejected = false;
  isApplicationApproved = false;
  applicationId: number | undefined;
  extensionApplicationForm!: FormGroup;
  alerts: any[] = [];

  constructor(
    private userRegistrationService: UserRegistrationService,
    private userAffiliateService: UserAffiliateService,
    private applicationUtilsService: ApplicationUtilsService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Parse the applicationId from the route and make sure it's valid
    const appId = this.route.snapshot.paramMap.get('applicationId');
    this.applicationId = appId ? +appId : undefined;

    if (!this.applicationId) {
      console.error('Invalid application ID');
      this.router.navigate(['/viewReleases']);
      return;
    }

    this.initializeForm();
    this.loadApplicationData();
  }

  // Initialize the reactive form
  initializeForm() {
    this.extensionApplicationForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(3)]],
      snoMedTC: [false, Validators.requiredTrue]
    });
  }

  // Fetch application data
  loadApplicationData() {
    this.userRegistrationService.getApplicationById(String(this.applicationId)).subscribe(
      (result) => {
        this.extensionForm = result;
        this.readOnly = !this.applicationUtilsService.isApplicationWaitingForApplicant(result);
        this.isApplicationWaitingForApplicant = this.applicationUtilsService.isApplicationWaitingForApplicant(result);
        this.isApplicationApproved = this.applicationUtilsService.isApplicationApproved(result);
        this.isApplicationRejected = this.applicationUtilsService.isApplicationRejected(result);
      },
      (error) => {
        console.error('Application not found', error);
        this.router.navigate(['/viewReleases']);
      }
    );
  }

  viewLicense(memberKey: string) {
    this.memberService.getMemberLicense(memberKey).subscribe((licenseData: string) => {
      window.open(licenseData, '_blank', 'noopener');
    });
  }

  submit() {
    if (!this.extensionApplicationForm || this.extensionApplicationForm.invalid) {
      this.extensionApplicationForm.markAllAsTouched();
      return;
    }

    this.extensionForm.approvalState = 'SUBMITTED';
    this.extensionForm.reason = this.extensionApplicationForm.get('reason')?.value;

    this.userRegistrationService.updateApplication(this.extensionForm).subscribe(
      (result) => {
        this.userAffiliateService.refreshAffiliate();
        this.router.navigate(['/userDashboard']);
      },
      (error) => {
        console.error('Failed to submit the application', error);
      }
    );
  }

  cancelApplication() {
    const modalRef = this.modalService.open(DeleteExtensionApplicationComponent, { size: 'sm' });

    modalRef.result.then(
      () => {
        this.userRegistrationService.deleteApplication(this.applicationId!).subscribe(
          () => {
            this.userAffiliateService.refreshAffiliate();
            this.router.navigate(['/userDashboard']);
          },
          (error) => {
            console.error('Failed to delete the application', error);
          }
        );
      },
      () => {
        // Handle cancel case
      }
    );
  }
}