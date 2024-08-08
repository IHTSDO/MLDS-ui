import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-edit-member-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-member-notifications.component.html',
  styleUrl: './edit-member-notifications.component.scss'
})
export class EditMemberNotificationsComponent implements OnInit {

@Input() member: any;
memberForm!: FormGroup;
alerts: any[] = [];
submitStatus: { notSubmitted: boolean; submitting: boolean; submitSuccessful: boolean } = {
  notSubmitted: true,
  submitting: false,
  submitSuccessful: false
};
submitAttempted = false;

constructor(
  public activeModal: NgbActiveModal,
  private fb: FormBuilder,
  private memberService: MemberService
) {}

ngOnInit(): void {
  this.memberForm = this.fb.group({
    staffNotificationEmail: [this.member.staffNotificationEmail, [Validators.email]]
  });
}

closeAlert(alert: any) {
  this.alerts = this.alerts.filter(a => a !== alert);
}

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