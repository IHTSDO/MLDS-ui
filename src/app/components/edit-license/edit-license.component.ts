import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditLicenseModalComponent } from '../edit-license-modal/edit-license-modal.component';

@Component({
  selector: 'app-edit-license',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-license.component.html',
  styleUrl: './edit-license.component.scss'
})
export class EditLicenseComponent implements OnInit {

  @Input() member: any;
  licenseForm!: FormGroup;
  submitStatus = { notSubmitted: true, submitting: false, submitSuccessful: false };
  alerts: Array<{ type: string, msg: string }> = [];
  file: File | null = null;


  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    public modal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      licenseName: [this.member?.licenseName || '', []],
      licenseVersion: [this.member?.licenseVersion || '', []]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.file = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.licenseForm.invalid) {
      return;
    }
    this.submitStatus.submitting = true;

    const formData = new FormData();
    formData.append('file', this.file as Blob);
    formData.append('licenseName', this.licenseForm.get('licenseName')?.value || '');
    formData.append('licenseVersion', this.licenseForm.get('licenseVersion')?.value || '');

    this.memberService.updateLicense(this.member.key,formData).subscribe(
      result => {
        const message = this.file ? 'New license has been uploaded.' : 'License name and version updated.';
        this.alerts.push({ type: 'success', msg: message });
        this.submitStatus.submitSuccessful = true;
        this.submitStatus.submitting = false;
      },
      error => {
        console.error(error);
        this.alerts.push({ type: 'danger', msg: 'Network request failure: please try again later.' });
        this.submitStatus.submitting = false;
      }
    );
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  openConfirmModal(): void {
    const modalRef = this.modalService.open(EditLicenseModalComponent, {
      backdrop: 'static'
    });
    modalRef.componentInstance.member = this.member;
    modalRef.result
      .then((result) => {
        if (result === 'Upload and Replace'){
          this.onSubmit();
        }
    })
    .catch((error) => {
      console.error('Modal dismissed or error occurred', error);
    });
  }
  

}