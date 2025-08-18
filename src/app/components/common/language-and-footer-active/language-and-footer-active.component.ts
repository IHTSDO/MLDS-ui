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
  imports: [ CommonModule, FormsModule
  ]
})

export class LanguageAndFooterActiveComponent implements OnInit {
  @Input() member: any; // Passed from parent modal trigger
  routes = ROUTES;

  languageKey: string = '';
  isFooterActive: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private memberService: MemberService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Use values from the passed @Input() member directly
    this.languageKey = this.member?.language ?? 'en'; // Default to 'en'
    this.isFooterActive = this.member?.footerActive ?? true; // Default to true
  }
  
  onSubmit(): void {
    // Clone the current member object so we don't mutate the original reference
    const updatedMember = { ...this.member };
  
    // Update the properties
    updatedMember.language = this.languageKey;
    updatedMember.footerActive = this.isFooterActive;
    console.log("Footer Status", this.isFooterActive);
    this.memberService.updateMember(updatedMember).subscribe(
      () => {
        this.toastr.success(
          `Details for member ${this.member.key} updated successfully!`,
          'Success'
        );
        this.activeModal.close();
        this.router.navigate([this.routes.memberManagement]);
      },
      () => {
        this.toastr.error(
          `Details for member ${this.member.key} could not be updated!`,
          'Error'
        );
        this.activeModal.close();
        this.router.navigate([this.routes.memberManagement]);
      }
    );
  }
  
  onCancel(): void {
    this.activeModal.dismiss();
  }
}