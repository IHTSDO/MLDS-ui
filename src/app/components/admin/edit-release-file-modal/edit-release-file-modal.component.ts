import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';

import { ReleaseFileService } from 'src/app/services/release-file/release-file.service';

@Component({
  selector: 'app-edit-release-file-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './edit-release-file-modal.component.html',
  styleUrl: './edit-release-file-modal.component.scss'
})
export class EditReleaseFileModalComponent implements OnInit {
  formReleaseFile: FormGroup;
  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  @Input() releaseFile: any;
  submitAttempted = false;
  submitting = false;
  alerts: { type: string, msg: string }[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private releaseFilesService: ReleaseFileService
  ) {
    this.formReleaseFile = this.fb.group({
      label: ['', Validators.required],
      downloadUrl: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)]],
      md5Hash: [''],
      fileSize: ['', [Validators.pattern(/^\d+$/)]],
      primaryFile: [false],
      releaseFileId: ['']
    });
  }

  ngOnInit(): void {
    this.formReleaseFile.patchValue({
      label: this.releaseFile?.label || '',
      downloadUrl: this.releaseFile?.downloadUrl || '',
      md5Hash: this.releaseFile?.md5Hash || '',
      fileSize: this.releaseFile?.fileSize || '',
      primaryFile: this.releaseFile?.primaryFile || false,
      releaseFileId: this.releaseFile?.releaseFileId || ''
    });
  }

  onSave(): void {
    this.submitAttempted = true;

    if (!this.formReleaseFile || this.formReleaseFile.invalid) {
      return;
    }

    this.submitting = true;
    this.alerts = [];

    this.releaseFilesService.update(
      this.releasePackage.releasePackageId,
      this.releaseVersion.releaseVersionId,
      this.releaseFile.releaseFileId,
      this.formReleaseFile.value
    ).subscribe({
      next: (result) => this.activeModal.close(result),
      error: () => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure: please try again later.' });
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}