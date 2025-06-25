import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditLicenseModalComponent } from '../edit-license-modal/edit-license-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * Component for editing a license.
 *
 * @example
 * <app-edit-license [member]="member"></app-edit-license>
 */
@Component({
    selector: 'app-edit-license',
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ModalComponent],
    templateUrl: './edit-license.component.html',
    styleUrl: './edit-license.component.scss'
})
export class EditLicenseComponent implements OnInit {

  /**
   * The member object to edit the license for.
   */
  @Input() member: any;

  isFileUploaded = false;
  /**
   * The form group for the license form.
   */
  licenseForm!: FormGroup;

  /**
   * The submit status of the form.
   */
  submitStatus = { notSubmitted: true, submitting: false, submitSuccessful: false };

  /**
   * Array of alerts to display.
   */
  alerts: Array<{ type: string, msg: string }> = [];

  /**
   * The file to upload.
   */
  file: File | null = null;

  /**
   * Constructor.
   *
   * @param fb The form builder.
   * @param memberService The member service.
   * @param modal The active modal.
   * @param modalService The modal service.
   */
  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    public modal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      licenseName: [this.member?.licenseName || '', []],
      licenseVersion: [this.member?.licenseVersion || '', []]
    });
  }

  /**
   * Handles file change event.
   *
   * @param event The file change event.
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.file = input.files[0];
      this.isFileUploaded = true;
    }
  }

  /**
   * Submits the form.
   */
  onSubmit(): void {
    if (this.licenseForm.invalid) {
      return;
    }
    this.submitStatus.submitting = true;

    const formData = new FormData();
    formData.append('file', this.file as Blob);
    formData.append('licenseName', this.licenseForm.get('licenseName')?.value || '');
    formData.append('licenseVersion', this.licenseForm.get('licenseVersion')?.value || '');

    this.memberService.updateLicense(this.member.key, formData).subscribe({
     next: result => {
        const message = this.file ? 'New license has been uploaded.' : 'License name and version updated.';
        this.alerts.push({ type: 'success', msg: message });
        this.submitStatus.submitSuccessful = true;
        this.submitStatus.submitting = false;
      },
      error: (error: any) => {
        console.error(error);
        this.alerts.push({ type: 'danger', msg: 'Network request failure: please try again later.' });
        this.submitStatus.submitting = false;
      }
  });
  }

  /**
   * Closes an alert.
   *
   * @param index The index of the alert to close.
   */
  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  /**
   * Opens the confirm modal.
   */
  openConfirmModal(): void {
    const modalRef = this.modalService.open(EditLicenseModalComponent, {
      backdrop: 'static'
    });
    modalRef.componentInstance.member = this.member;
    modalRef.result
      .then((result) => {
        if (result === 'Upload and Replace') {
          this.onSubmit();
        }
      })
      .catch((error) => {
        console.error('Modal dismissed or error occurred', error);
      });
  }
}