import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';

import { ReleaseFileService } from 'src/app/services/release-file/release-file.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-add-release-file-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgbAlert, QuillModule, ModalComponent],
  templateUrl: './add-release-file-modal.component.html',
  styleUrl: './add-release-file-modal.component.scss'
})
export class AddReleaseFileModalComponent implements OnInit {
  isNewObject = true;
  releasePackage: any;
  releaseVersion: any;
  releaseFile: any = {};
  formReleaseFile: FormGroup;
  submitAttempted = false;
  submitting = false;
  alerts: Array<{ type: string, msg: string }> = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private releaseFilesService: ReleaseFileService
  ) {
    this.formReleaseFile = this.fb.group({
      label: ['', Validators.required],
      downloadUrl: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)]],
      md5Hash: [''],
      fileSize: ['', [Validators.pattern(/^\d+$/)]],
      primaryFile: [false]
    });
  }

  ngOnInit(): void {
    this.isNewObject = !this.releaseVersion.releaseVersionId;
  }

  ok(): void {
    this.submitAttempted = true;
    if (this.formReleaseFile.invalid) {
      return;
    }
    this.submitting = true;
    this.alerts = [];
    const releaseFileData = this.formReleaseFile.value;

    this.releaseFilesService.save(
      this.releasePackage.releasePackageId,
      this.releaseVersion.releaseVersionId,
      releaseFileData
    ).subscribe({
      next: (result) => {
        this.activeModal.close(result);
      },
      error: (error) => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [36]: please try again later.' });
        this.submitting = false;
      }
    });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }
}