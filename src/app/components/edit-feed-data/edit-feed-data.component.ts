import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-edit-feed-data',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-feed-data.component.html',
  styleUrl: './edit-feed-data.component.scss'
})
export class EditFeedDataComponent implements OnInit {
  @Input() member: any;
  memberFeedForm: FormGroup = this.fb.group({
    memberOrgName: [''],
    memberOrgURL: [''],
    contactEmail: ['']
  });
  alerts: any[] = [];
  submitStatus: { submitting: boolean; submitSuccessful: boolean } = { submitting: false, submitSuccessful: false };
  submitAttempted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.memberFeedForm = this.fb.group({
      memberOrgName: [this.member?.memberOrgName || '', []],
      memberOrgURL: [this.member?.memberOrgURL || '', []],
      contactEmail: [this.member?.contactEmail || '', [Validators.email]]
    });
  }

  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.alerts = [];
    this.submitStatus.submitting = true;

    if (this.memberFeedForm.valid) {
      const { memberOrgName, memberOrgURL, contactEmail } = this.memberFeedForm.value;
      this.memberService.updateMemberFeedData(this.member.key, memberOrgName, memberOrgURL, contactEmail)
        .pipe(
          catchError(error => {
            this.alerts.push({
              type: 'danger',
              msg: `Network request failure: please try again later. [${error.message}]`
            });
            this.submitStatus.submitting = false;
            return of(null);
          })
        )
        .subscribe({
          next: () => {
            this.submitStatus.submitSuccessful = true;
            this.activeModal.close(); 
          },
          complete: () => {
            this.submitStatus.submitting = false;
          }
        });
    }
  }
}
