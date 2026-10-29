
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';

@Component({
  selector: 'app-language-and-footer-active',
  templateUrl: './language-and-footer-active.component.html',
  styleUrls: ['./language-and-footer-active.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LanguageAndFooterActiveComponent implements OnInit {

  @Input() member: any;

  routes = ROUTES;

  languageKey: string = '';
  isFooterActive: boolean = true;
  isActive: boolean = true;
  isSaving: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private memberService: MemberService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.languageKey = this.member?.language ?? 'en';
    this.isFooterActive = this.member?.footerActive ?? true;

    // Read memberActive from the backend response.
    this.isActive = this.member?.memberActive === true;
  }

  onSubmit(): void {
    if (!this.member?.key || this.isSaving) {
      return;
    }

    this.isSaving = true;

    // Clone the member to avoid modifying the original object.
    const updatedMember = {
      ...this.member,
      language: this.languageKey,
      footerActive: this.isFooterActive,
      memberActive: this.isActive
    };

    this.memberService.updateMember(updatedMember).subscribe({
      next: () => {
        this.isSaving = false;

        this.toastr.success(
          `Details for member ${this.member.key} updated successfully!`,
          'Success'
        );

        this.activeModal.close();
        this.router.navigate([this.routes.memberManagement]);
      },
      error: (error) => {
        this.isSaving = false;

        console.error('Error updating member:', error);

        this.toastr.error(
          `Details for member ${this.member.key} could not be updated!`,
          'Error'
        );
      }
    });
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
