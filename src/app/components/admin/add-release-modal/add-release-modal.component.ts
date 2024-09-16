import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';

@Component({
  selector: 'app-add-release-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbAlert, QuillModule, ReactiveFormsModule],
  templateUrl: './add-release-modal.component.html',
  styleUrl: './add-release-modal.component.scss'
})
export class AddReleaseModalComponent implements OnInit {
  public formPackage!: FormGroup;
  public submitting = false;
  public submitAttempted = false;
  public alerts: any[] = [];
  public members: any[] = [];
  public isAdmin: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private packagesService: PackagesService,
    private memberService: MemberService,
    private router: Router,
    private sessionService: AuthenticationSharedService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.sessionService.isAdmin();
    this.members = this.memberService.members;
    this.initializeForm();
  }

  private initializeForm(): void {
    const currentMember = this.sessionService.getUserDetails()?.member;
    this.formPackage = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      member: [this.members.find((m: any) => m.key === currentMember?.['key']) || null, Validators.required],
      releasePackageURI: [''],
      copyrights: ['']
    });
  }

  public ok(): void {
    this.submitAttempted = true;
    if (this.formPackage.invalid) {
      return;
    }

    this.submitting = true;
    this.alerts = [];

    this.packagesService.save(this.formPackage.value).subscribe({
      next: (result: any) => {
        this.router.navigate(['/releaseManagement/release', encodeURIComponent(result.releasePackageId)]);
        this.activeModal.close(result);
      },
      error: (error) => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [29]: please try again later.' });
        this.submitting = false;
      }
    });
  }

  close() {
    this.activeModal.dismiss();
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

}