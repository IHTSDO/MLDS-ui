import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { QuillModule } from 'ngx-quill';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-add-edit-release-version-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbAlert,NgbModule,QuillModule,ModalComponent],
  templateUrl: './add-edit-release-version-modal.component.html',
  styleUrl: './add-edit-release-version-modal.component.scss'
})
export class AddEditReleaseVersionModalComponent implements OnInit {
  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  @ViewChild('nameInput', { static: false }) nameInput!: ElementRef;
  releaseVersionForm!: FormGroup;
  isNewObject = false;
  submitAttempted = false;
  submitting = false;
  alerts: Array<{ type: string, msg: string }> = [];
  dateOpen: { [key: string]: boolean } = {};

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private releaseVersionsService: ReleaseVersionsService
  ) {}

  ngOnInit(): void {
    this.isNewObject = !this.releaseVersion?.releaseVersionId;
    this.initializeForm();
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 0);
  }

  private initializeForm(): void {
    this.releaseVersionForm = this.fb.group({
      name: [this.releaseVersion?.name || '', Validators.required],
      description: [this.releaseVersion?.description || '', Validators.required],
      packageType: [this.releaseVersion?.packageType || '', Validators.required],
      summary: [this.releaseVersion?.summary || ''],
      versionURI: [this.releaseVersion?.versionURI || ''],
      versionDependentURI: [this.releaseVersion?.versionDependentURI || ''],
      versionDependentDerivativeURI: [this.releaseVersion?.versionDependentDerivativeURI || ''],
      releaseType: [this.releaseVersion?.releaseType || '', Validators.required],
      // publishedAt: [this.releaseVersion?.publishedAt ? this.convertToNgbDate(new Date(this.releaseVersion.publishedAt)) : ''],
      publishedAt: [this.releaseVersion?.publishedAt ? this.convertToNgbDate(new Date(this.releaseVersion.publishedAt)) : null],
    });
  }

  openDate(event: Event, name: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dateOpen[name] = true;
  }


  private convertToNgbDate(date: Date): { year: number; month: number; day: number } | null {
    if (date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    }
    return null;
  }  

  serializeDate(date: any): string | null {
    if (date?.year && date?.month !== undefined && date?.day) {
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return moment(jsDate).format('YYYY-MM-DD');
    }
    return null;
}



  saveReleaseVersion(): void {
    this.submitAttempted = true;
    
    if (this.releaseVersionForm.invalid) {
      return;
    }

    this.submitting = true;
    this.alerts = [];

    const formData = {
      ...this.releaseVersionForm.value,
      publishedAt: this.serializeDate(this.releaseVersionForm.value.publishedAt)
    };


    const saveOrUpdate = this.isNewObject 
      ? this.releaseVersionsService.save(this.releasePackage.releasePackageId, formData)
      : this.releaseVersionsService.update(this.releasePackage.releasePackageId, this.releaseVersion.releaseVersionId, formData);
    
    saveOrUpdate.subscribe({
      next: (result) => this.activeModal.close(result),
      error: () => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [10]: please try again later.' });
        this.submitting = false;
      }
    });
  }
}