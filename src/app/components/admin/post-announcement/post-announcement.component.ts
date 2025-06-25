import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';


import { catchError, map, Observable, of } from 'rxjs';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PostAnnouncementService } from 'src/app/services/post-announcement/post-announcement.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";


@Component({
    selector: 'app-post-announcement',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, QuillModule, TranslateModule, EnumPipe, CompareTextPipe],
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private announcementsService: PostAnnouncementService,
    private memberService: MemberService,
    private sessionService: AuthenticationSharedService
  ) {
    const userDetails = this.sessionService.getUserDetails();
    this.announcementForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      emailListString: [{ value: userDetails?.email ?? '', disabled: this.completed }],
      includeAllAffiliates: [0]
    });
    this.emailListString = userDetails?.email ?? '';  // Initialize the email list string
  }

  ngOnInit(): void {
    const userDetails = this.sessionService.getUserDetails();
    this.isAdmin = this.sessionService.isAdmin();
    this.memberKey = userDetails?.member['key'];
  }

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
          allAffiliates: this.isAdmin && this.announcementForm.value.includeAllAffiliates,
          additionalEmails: this.announcementForm.value.emailListString.split(/[ ,;]+/)
        };

        this.announcementsService.postAnnouncement(announcement).subscribe({
          next: () => {
            this.submitting = false;
            this.completed = true;
            this.alerts.push({ type: 'success', msg: 'Announcement has been successfully posted.' });
          },
          error: () => {
            this.alerts.push({ type: 'danger', msg: 'Network request failure [7]: please try again later.' });
            this.submitting = false;
          }
        });
      } else {
        this.alerts.push({ type: 'danger', msg: 'Member details could not be loaded.' });
        this.submitting = false;
      }
    });
  }

  newAnnouncement(): void {
    this.completed = false;
    this.announcementForm.reset({
      subject: '',
      body: '',
      emailListString: { value: this.sessionService.getUserDetails()?.email ?? '', disabled: this.completed }, // Bind the original email here
      includeAllAffiliates: 0
    });
    this.emailListString = this.sessionService.getUserDetails()?.email ?? ''; // Reset the emailListString variable
    this.alerts = [];
  }
  

  closeAlert(alert: { type: string; msg: string }): void {
    const index = this.alerts.indexOf(alert);
    if (index >= 0) {
      this.alerts.splice(index, 1);
    }
  }
}