import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';

import { catchError, map, Observable, of } from 'rxjs';

import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PostAnnouncementService } from 'src/app/services/post-announcement/post-announcement.service';

import { EnumPipe } from '../../../pipes/enum/enum.pipe';
import { CompareTextPipe } from '../../../pipes/compare-text/compare-text.pipe';
import { NgbModal, NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-post-announcement',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule,
    TranslateModule,
    EnumPipe,
    CompareTextPipe,
    NgbModule
  ],
  templateUrl: './post-announcement.component.html',
  styleUrl: './post-announcement.component.scss'
})
export class PostAnnouncementComponent implements OnInit {

  alerts: Array<{ type: string, msg: string }> = [];

  announcementForm: FormGroup;

  emailListString = '';

  includeAllAffiliates = 0;

  isAdmin: boolean | undefined;

  submitting = false;

  completed = false;

  memberKey: any;

  member: any = null;

  // TEST EMAIL MODAL

  @ViewChild('testEmailModal') testEmailModal!: TemplateRef<any>;
  modalRef?: NgbModalRef;

  showTestEmailModal = false;

  testEmailInput = '';

  testEmails: string[] = [];

  // VALIDATION ERROR

  testEmailError = '';

  // ALLOWED DOMAINS

  allowedDomainsList: any[] = [];

  domainInput = '';
  
  editingDomainId: number | null = null;
  maxTestEmailCount!: number;

  isMaxCountLoaded = false;

  testEmailControl = this.fb.control('', [
  Validators.email
]);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private announcementsService: PostAnnouncementService,
    private memberService: MemberService,
    private sessionService: AuthenticationSharedService,
    private modalService: NgbModal
  ) {

    const userDetails = this.sessionService.getUserDetails();

    this.announcementForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      emailListString: [{
        value: userDetails?.email ?? '',
        disabled: this.completed
      }],
      includeAllAffiliates: [0]
    });

    this.emailListString = userDetails?.email ?? '';
  }

  ngOnInit(): void {

    const userDetails = this.sessionService.getUserDetails();

    this.isAdmin = this.sessionService.isAdmin();

    this.memberKey = userDetails?.member['key'];

    this.loadDomains();
    this.loadMaxTestEmailCount();

     this.testEmailControl.valueChanges.subscribe(() => {

    this.validateTestEmail();

  });
}

onTestEmailChange(): void {

  this.validateTestEmail();

}






loadMaxTestEmailCount(): void {

  this.announcementsService
    .getMaxTestEmailCount()
    .subscribe({

      next: (response: number) => {

        this.maxTestEmailCount = response;

        this.isMaxCountLoaded = true;
      },

      error: () => {

        this.testEmailError =
        'Unable to load maximum email count.';
      }
    });
}
  // OPEN TEST EMAIL MODAL

  openTestEmailModal(): void {
    this.showTestEmailModal = true;
    this.modalRef = this.modalService.open(this.testEmailModal, { size: 'lg', backdrop: 'static', centered: true });
  }

  // CLOSE TEST EMAIL MODAL
  closeTestEmailModal(): void {
    this.showTestEmailModal = false;
    if (this.modalRef) {
      this.modalRef.close();
    }
  
    this.testEmailInput = '';
  
    this.testEmailError = '';
  
    this.testEmails = [];
  }

  // VALIDATE TEST EMAIL

  validateTestEmail(): void {

    this.testEmailError = '';

    // EMPTY VALIDATION
const emailValue = this.testEmailControl.value;

if (!emailValue || !emailValue.trim()) {
      return;
    }

    const email = emailValue.trim().toLowerCase();

    // EMAIL FORMAT VALIDATION

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      this.testEmailError =
        'Please enter a valid email address.';

      return;
    }

    // MAXIMUM LIMIT VALIDATION

    if (this.testEmails.length >= this.maxTestEmailCount) {

      this.testEmailError =
      `Maximum ${this.maxTestEmailCount} test email addresses are allowed.`;

      return;
}

    // DOMAIN VALIDATION
    const domain = email.split('@')[1];

    const allowedDomains =
    this.allowedDomainsList.map(
       item => item.domainName.toLowerCase()
    );
    
    if (!allowedDomains.includes(domain)) {
    
          this.testEmailError =
          `Only allowed domains are permitted: ${allowedDomains.join(', ')}`;
    
          return;
    }

    // DUPLICATE VALIDATION

    if (this.testEmails.includes(email)) {

      this.testEmailError =
        'Email address already added.';

      return;
    }
  }
  loadDomains(): void {

    this.announcementsService
    .getTestEmailDomains()
    .subscribe({

        next:(response:any)=>{

            this.allowedDomainsList=response;
            this.validateTestEmail();
        }
    });
}


addDomain(): void {

    if(!this.domainInput?.trim()){

        return;
    }

    const payload={

        domainName:this.domainInput.trim()
    };

    this.announcementsService
    .createTestEmailDomain(payload)
    .subscribe({

        next:()=>{

            this.domainInput='';

            this.loadDomains();
        }
    });
}


editDomain(domain:any):void{

    this.editingDomainId=domain.id;

    this.domainInput=domain.domainName;
}


updateDomain():void{

    if(!this.editingDomainId){

        return;
    }

    const payload={

        domainName:this.domainInput
    };

    this.announcementsService
    .updateTestEmailDomain(
        this.editingDomainId,
        payload
    )
    .subscribe({

        next:()=>{

            this.domainInput='';

            this.editingDomainId=null;

            this.loadDomains();
        }
    });
}


deleteDomain(id:number):void{

    this.announcementsService
    .deleteTestEmailDomain(id)
    .subscribe({

        next:()=>{

            this.loadDomains();

            this.validateTestEmail();
            
        }
    });
}
  // ADD TEST EMAIL

addTestEmail(): void {

  this.validateTestEmail();

  if (this.testEmailError) {
    return;
  }

  const email = this.testEmailControl.value?.trim().toLowerCase();

  if (!email) {
    return;
  }

  this.testEmails.push(email);

  // CLEAR INPUT

  this.testEmailControl.reset();

  this.testEmailError = '';
}

  // REMOVE TEST EMAIL

  removeTestEmail(index: number): void {

    this.testEmails.splice(index, 1);

    // REVALIDATE

    this.validateTestEmail();
  }

  // LOAD MEMBER DETAILS

  sessionMemberPopulated(): Observable<any> {

    const userDetails = this.sessionService.getUserDetails();

    const memberKey = userDetails?.member['key'];

    return this.memberService.getMembers().pipe(

      map((members: any[]) => {

        const member = members.find(m => m.key === memberKey);

        return member || null;
      }),

      catchError(error => {

        console.error('Error loading member details', error);

        return of(null);
      })
    );
  }

  // SEND TEST EMAIL

  sendTestEmail(): void {

    if (this.testEmails.length === 0) {

      this.alerts.push({
        type: 'danger',
        msg: 'Please add at least one test email address.'
      });

      return;
    }

    const payload = {
      subject: this.announcementForm.value.subject,
      body: this.announcementForm.value.body,
      testEmails: this.testEmails
    };

    this.announcementsService.sendTestEmail(payload)
      .subscribe({

        next: () => {

          const successAlert = {
            type: 'success',
            msg: 'Test email sent successfully.'
          };
        
          this.alerts.push(successAlert);
        
          // CLEAR POPUP VALUES
        
          this.testEmails = [];
        
          this.testEmailInput = '';
        
          this.testEmailError = '';
        
          // CLOSE POPUP
        
          this.closeTestEmailModal();
        
          // AUTO HIDE ALERT AFTER 15 SECONDS
        
          setTimeout(() => {
        
            const index = this.alerts.indexOf(successAlert);
        
            if (index >= 0) {
        
              this.alerts.splice(index, 1);
            }
        
          }, 15000);
        },

        error: () => {

          this.alerts.push({
            type: 'danger',
            msg: 'Failed to send test email.'
          });
        }
      });
  }

  // POST ANNOUNCEMENT

  postAnnouncement(): void {

    if (this.announcementForm.invalid || this.completed) {

      this.announcementForm.markAllAsTouched();

      return;
    }

    this.submitting = true;

    this.alerts = [];

    this.sessionMemberPopulated().subscribe(member => {

      if (member) {

        const announcement = {

          subject: this.announcementForm.value.subject,

          body: this.announcementForm.value.body,

          member: member,

          allAffiliates:
            this.isAdmin &&
            this.announcementForm.value.includeAllAffiliates,

          additionalEmails:
            this.announcementForm.value.emailListString
              .split(/[ ,;]+/)
        };

        this.announcementsService
          .postAnnouncement(announcement)
          .subscribe({

            next: () => {

              this.submitting = false;

              this.completed = true;

              this.alerts.push({
                type: 'success',
                msg: 'Announcement has been successfully posted.'
              });
            },

            error: () => {

              this.alerts.push({
                type: 'danger',
                msg: 'Network request failure [7]: please try again later.'
              });

              this.submitting = false;
            }

          });

      } else {

        this.alerts.push({
          type: 'danger',
          msg: 'Member details could not be loaded.'
        });

        this.submitting = false;
      }
    });
  }

  // RESET FORM

  newAnnouncement(): void {

    this.completed = false;

    this.announcementForm.reset({

      subject: '',

      body: '',

      emailListString: {
        value: this.sessionService.getUserDetails()?.email ?? '',
        disabled: this.completed
      },

      includeAllAffiliates: 0
    });

    this.emailListString =
      this.sessionService.getUserDetails()?.email ?? '';

    this.alerts = [];
  }

  // CLOSE ALERT

  closeAlert(alert: { type: string; msg: string }): void {

    const index = this.alerts.indexOf(alert);

    if (index >= 0) {

      this.alerts.splice(index, 1);
    }
  }
}