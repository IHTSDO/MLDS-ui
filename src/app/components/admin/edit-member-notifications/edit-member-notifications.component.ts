import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MemberService } from 'src/app/services/member/member.service';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * EditMemberNotificationsComponent - A component to edit member notifications
 *
 * This component allows the user to edit the staff notification email for a member.
 *
 * @example
 * <app-edit-member-notifications [member]="member"></app-edit-member-notifications>
 */
@Component({
    selector: 'app-edit-member-notifications',
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ModalComponent],
    templateUrl: './edit-member-notifications.component.html',
    styleUrls: ['./edit-member-notifications.component.scss']
})
export class EditMemberNotificationsComponent implements OnInit {
  /**
   * The member object to be edited
   */
  @Input() member: any;

  /**
   * The form group for the staff notification email
   */
  memberForm!: FormGroup;

  /**
   * An array of alerts to display to the user
   */
  alerts: any[] = [];

  /**
   * The submit status of the form
   */
  submitStatus: {
    notSubmitted: boolean;
    submitting: boolean;
    submitSuccessful: boolean;
  } = {
    notSubmitted: true,
    submitting: false,
    submitSuccessful: false
  };

  /**
   * Whether the form has been attempted to be submitted
   */
  submitAttempted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberService: MemberService
  ) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.memberForm = this.fb.group({
      staffNotificationEmail: [this.member.staffNotificationEmail, [Validators.email]]
    });
  }

  /**
   * Closes an alert
   *
   * @param alert The alert to close
   */
  closeAlert(alert: any) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  /**
   * Submits the form
   */
  onSubmit() {
    this.submitAttempted = true;
    this.alerts = [];
    this.submitStatus.submitting = true;
    this.submitStatus.notSubmitted = false;

    if (this.memberForm.valid || !this.memberForm.get('staffNotificationEmail')?.value) {
      this.memberService.updateMemberNotifications(this.member.key, this.memberForm.value.staffNotificationEmail)
        .subscribe({
          next: () => {
            this.submitStatus.submitSuccessful = true;
            this.submitStatus.submitting = false;
            this.activeModal.close();
          },
          error: (message) => {
            this.alerts.push({
              type: 'danger',
              msg: `Network request failure: please try again later. [${message.statusText}]`
            });
            this.submitStatus.submitting = false;
          }
        });
    } else {
      this.alerts.push({
        type: 'danger',
        msg: 'Please enter a valid email address.'
      });
      this.submitStatus.submitting = false;
    }
  }
}