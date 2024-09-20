/**
 * Edit Feed Data Component
 *
 * This component is used to edit the feed data of a member.
 *
 * @example
 * <app-edit-feed-data [member]="member"></app-edit-feed-data>
 *
 * @selector app-edit-feed-data
 * @standalone true
 * @imports [CommonModule, ReactiveFormsModule]
 */
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { MemberService } from 'src/app/services/member/member.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * Edit Feed Data Component
 *
 * @param member The member object to be edited
 */
@Component({
  selector: 'app-edit-feed-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnumPipe,TranslateModule, ModalComponent],
  templateUrl: './edit-feed-data.component.html',
  styleUrl: './edit-feed-data.component.scss'
})
export class EditFeedDataComponent implements OnInit {
  /**
   * The member object to be edited
   */
  @Input() member: any;

  /**
   * The form group for the member feed data
   */
  memberFeedForm: FormGroup = this.fb.group({
    memberOrgName: [''],
    memberOrgURL: [''],
    contactEmail: ['']
  });

  /**
   * The alerts array to display any errors or success messages
   */
  alerts: any[] = [];

  /**
   * The submit status object to track the submitting and submit successful status
   */
  submitStatus: { submitting: boolean; submitSuccessful: boolean } = { submitting: false, submitSuccessful: false };

  /**
   * The submit attempted flag to track if the form has been submitted
   */
  submitAttempted = false;

  /**
   * Constructor
   *
   * @param activeModal The active modal instance
   * @param fb The form builder instance
   * @param memberService The member service instance
   */
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberService: MemberService
  ) {}

  /**
   * On Init lifecycle hook
   */
  ngOnInit(): void {
    this.memberFeedForm = this.fb.group({
      memberOrgName: [this.member?.memberOrgName || '', []],
      memberOrgURL: [this.member?.memberOrgURL || '', []],
      contactEmail: [this.member?.contactEmail || '', [Validators.email]]
    });
  }

  /**
   * Close Alert
   *
   * Closes the alert message
   *
   * @param alert The alert object to be closed
   */
  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  /**
   * On Submit
   *
   * Submits the form data to update the member feed data
   */
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