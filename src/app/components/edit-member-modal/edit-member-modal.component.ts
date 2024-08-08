import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-edit-member-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgbModule],
  templateUrl: './edit-member-modal.component.html',
  styleUrl: './edit-member-modal.component.scss'
})
export class EditMemberModalComponent implements OnInit{
  @Input() member: any;
  memberBrandForm: FormGroup;
  submitStatus = { submitting: false, submitSuccessful: false };
  alerts: any[] = [];

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

  ngOnInit(): void {
    if (this.member) {
      this.memberBrandForm.patchValue({
        memberName: this.member.name || ''
      });
    }
  }

  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.memberBrandForm.patchValue({ file });
    }
  }

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