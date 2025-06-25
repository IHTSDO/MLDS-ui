import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { catchError, finalize } from 'rxjs';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { ModalComponent } from '../../common/modal/modal.component';


@Component({
    selector: 'app-edit-release-package-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, TranslateModule, EnumPipe, ModalComponent],
    templateUrl: './edit-release-package-modal.component.html',
    styleUrl: './edit-release-package-modal.component.scss'
})
export class EditReleasePackageModalComponent {
  @Input() releasePackage: any;
  submitAttempted = false;
  submitting = false;
  isAdmin = false;
  alerts: Array<{ type: string, msg: string }> = [];
  public members: any[] = [];
  formPackage: FormGroup;
  selectedMember: any;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private packagesService: PackagesService,
    private memberService: MemberService,
    private session: AuthenticationSharedService
  ) {
    this.formPackage = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      member: [null],
      releasePackageURI: [''],
      copyrights: [''],
      priority: ['']
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.session.isAdmin();

    this.memberService.getMembers().subscribe({
      next: (members: any[]) => {
        this.members = members;

        if (this.releasePackage) {
          const initialMember = this.members.find(member => member.key === this.releasePackage.member?.key);
          this.selectedMember = initialMember || null;
          this.formPackage.patchValue({
            name: this.releasePackage.name || '',
            description: this.releasePackage.description || '',
            member: initialMember,
            releasePackageURI: this.releasePackage.releasePackageURI || '',
            copyrights: this.releasePackage.copyrights || '',
            priority: this.releasePackage.priority || ''
          });
        }
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }

  onSubmit(): void {

    this.submitAttempted = true;
    this.alerts = [];

    if (this.formPackage.invalid) {
      return;
    }

    this.submitting = true;
    this.packagesService.updateReleasePackage(this.releasePackage.releasePackageId, this.formPackage.value).pipe(
      finalize(() => this.submitting = false),
      catchError((error) => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [18]: please try again later.' });
        return [];
      })
    ).subscribe((result) => {
      this.activeModal.close(result);
    });
  }
}
