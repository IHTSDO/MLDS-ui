import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbActiveModal, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { QuillModule } from 'ngx-quill';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { UrlMismatchWarningModalComponent } from '../url-mismatch-warning-modal/url-mismatch-warning-modal.component';
import { ModalComponent } from '../../common/modal/modal.component';

export const SCT_VERSION_URI_RE = /^http:\/\/snomed\.info\/x?sct\/[0-9]{6,18}\/version\/(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

@Component({
    selector: 'app-add-edit-release-version-modal',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, QuillModule, ModalComponent],
    templateUrl: './add-edit-release-version-modal.component.html',
    styleUrl: './add-edit-release-version-modal.component.scss'
})
export class AddEditReleaseVersionModalComponent implements OnInit {
  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  @Input() isArchivePage: boolean = false;
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
    private releaseVersionsService: ReleaseVersionsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isNewObject = !this.releaseVersion?.releaseVersionId;
    this.initializeForm();
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 0);
  }

  isOtherPackage(): boolean {
    return this.releaseVersionForm?.get('packageType')?.value === 'OTHER';
  }

  isControlInvalid(controlName: string, errorType?: string): boolean {
    const control = this.releaseVersionForm?.get(controlName);
    if (!control) return false;
    const isInvalid = errorType ? !!control.errors?.[errorType] : control.invalid;
    return isInvalid && (this.submitAttempted || control.touched || control.dirty);
  }

  versionUriPlaceholder(): string {
    return this.isOtherPackage()
      ? 'Enter release version'
      : 'http://snomed.info/sct/<moduleId>/version/<YYYYMMDD>';
  }

  versionUriError(): string {
    return this.isOtherPackage()
      ? ''
      : 'Must be a valid SNOMED CT version URI, e.g. http://snomed.info/sct/32506021000036107/version/20260601 (scheme must be http, not https)';
  }

  private versionUriValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      if (this.isOtherPackage()) {
        return null;
      }
      return SCT_VERSION_URI_RE.test(control.value) ? null : { pattern: true };
    };
  }

  private initializeForm(): void {
    this.releaseVersionForm = this.fb.group({
      name: [this.releaseVersion?.name || '', Validators.required],
      description: [this.releaseVersion?.description || '', Validators.required],
      packageType: [this.releaseVersion?.packageType || '', Validators.required],
      summary: [this.releaseVersion?.summary || ''],
      versionURI: [
        this.releaseVersion?.versionURI || '',
        [Validators.required, this.versionUriValidator()]
      ],
      versionDependentURI: [
        this.releaseVersion?.versionDependentURI || '',
        [Validators.pattern(SCT_VERSION_URI_RE)]
      ],
      versionDependentDerivativeURI: [
        this.releaseVersion?.versionDependentDerivativeURI || '',
        [Validators.pattern(SCT_VERSION_URI_RE)]
      ],
      releaseType: [this.releaseVersion?.releaseType || '', Validators.required],
      publishedAt: [this.releaseVersion?.publishedAt ? this.convertToNgbDate(new Date(this.releaseVersion.publishedAt)) : null, Validators.required],
    });

    this.releaseVersionForm.get('packageType')?.valueChanges.subscribe(() => {
      this.releaseVersionForm.get('versionURI')?.updateValueAndValidity();
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

  hasUrlMismatches(htmlContent: string): boolean {
    if (!htmlContent) return false;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const links = tempDiv.querySelectorAll('a');
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute('href');
      const text = link.textContent?.trim() || '';
      
      if (href && (text.startsWith('http://') || text.startsWith('https://'))) {
        if (href.trim() !== text) {
          return true;
        }
      }
    }
    return false;
  }

  saveReleaseVersion(): void {
    this.submitAttempted = true;
    
    if (this.releaseVersionForm.invalid) {
      return;
    }

    const descriptionHtml = this.releaseVersionForm.value.description;
    if (this.hasUrlMismatches(descriptionHtml)) {
      const modalRef = this.modalService.open(UrlMismatchWarningModalComponent, { backdrop: 'static' });
      modalRef.result.then((confirmed) => {
        if (confirmed) {
          this.executeSave();
        }
      }).catch(() => {});
    } else {
      this.executeSave();
    }
  }

  private executeSave(): void {
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