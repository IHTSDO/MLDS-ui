import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';

/**
 * Edit Member Modal Component
 *
 * A modal component for editing a member's details.
 */
@Component({
  selector: 'app-edit-member-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './edit-member-modal.component.html',
  styleUrls: ['./edit-member-modal.component.scss']
})
export class EditMemberModalComponent implements OnInit {
  /**
   * Input member object
   *
   * The member object to be edited.
   */
  @Input() member: any;

  /**
   * Member brand form
   *
   * The form for editing the member's brand details.
   */
  memberBrandForm: FormGroup;

  /**
   * Submit status
   *
   * Tracks the submit status of the form.
   */
  submitStatus = { submitting: false, submitSuccessful: false };

  /**
   * Alerts
   *
   * An array of alerts to be displayed to the user.
   */
  alerts: any[] = [];

  /**
   * Constructor
   *
   * Initializes the component with the necessary dependencies.
   *
   * @param activeModal The active modal instance.
   * @param fb The form builder instance.
   * @param memberService The member service instance.
   */
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberService: MemberService
  ) {
    this.memberBrandForm = this.fb.group({
      memberName: ['', Validators.required],
      file: [null]
    });
  }

  /**
   * OnInit lifecycle hook
   *
   * Initializes the component when it is created.
   */
  ngOnInit(): void {
    if (this.member) {
      this.memberBrandForm.patchValue({
        memberName: this.member.name || ''
      });
    }
  }

  /**
   * Close alert
   *
   * Closes an alert message.
   *
   * @param alert The alert to be closed.
   */
  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  /**
   * On file change
   *
   * Handles file changes in the form.
   *
   * @param event The file change event.
   */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.memberBrandForm.patchValue({ file });
    }
  }

  /**
   * Submit
   *
   * Submits the form data to the server.
   */
  submit(): void {
    if (this.memberBrandForm.invalid) {
      return;
    }

    this.alerts = [];
    this.submitStatus.submitting = true;
    const file = this.memberBrandForm.get('file')?.value;

    const formData = new FormData();
    formData.append('file', this.memberBrandForm.get('file')?.value);
    formData.append('name', this.memberBrandForm.get('memberName')?.value);

    /**
     * Example: Update member brand
     *
     * Calls the member service to update the member's brand details.
     */
    this.memberService.updateMemberBrand(this.member.key, formData)
      .subscribe({
        next: (result) => {
          const message = file ? 'New logo has been uploaded.' : 'Member name updated.';
          this.alerts.push({ type: 'success', msg: message });
          this.submitStatus.submitSuccessful = true;
          this.submitStatus.submitting = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.alerts.push({ type: 'danger', msg: `Network request failure: please try again later. [${error.message}]` });
          this.submitStatus.submitting = false;
        }
      });
  }
}