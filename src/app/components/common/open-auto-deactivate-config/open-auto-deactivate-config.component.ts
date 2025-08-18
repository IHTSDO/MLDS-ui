import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-open-auto-deactivate-config',
    imports: [CommonModule, FormsModule],
    templateUrl: './open-auto-deactivate-config.component.html',
    styleUrl: './open-auto-deactivate-config.component.scss'
})
export class OpenAutoDeactivateConfigComponent implements OnInit {
  @Input() member: any;
  showAutoDeactivateField: boolean = false;
 routes = ROUTES;
  application: number | null = null;
  usageReports: number | null = null;
  accountsWithPendingInvoice: number | null = null;

  constructor(public activeModal: NgbActiveModal,private memberService: MemberService,private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {
    if (this.member && this.member.key === 'IHTSDO') {
      this.showAutoDeactivateField = true;
    }

    // Call service and assign values
    this.memberService.getAutoDeactivationDetails(this.member.key).subscribe((data) => {
      this.application = data.pendingApplications ?? null;
      this.usageReports = data.usageReports ?? null;
      this.accountsWithPendingInvoice = data.invoicesPending ?? null;
    });
  }

  onSubmit() {
    const pendingApplications = this.application ?? 0;
    const invoicesPending = this.accountsWithPendingInvoice ?? 0;
    const usageReports = this.usageReports ?? 0;
    this.memberService.updateAutoDeactivationDetails(
      this.member.key,
      pendingApplications,
      invoicesPending,
      usageReports

    ).subscribe(
      
      (response) => {  // Explicitly handle string response
        
        this.toastr.success(`AutoDeactivation Details for the member ${this.member.key} Added Successfully!`, 'Success');
        this.activeModal.close();
        this.router.navigate([this.routes.memberManagement]);
      },
      
      error => {
        this.toastr.error(`AutoDeactivation Details for the member ${this.member.key} Not Updated!`, 'Error');
        this.activeModal.close();
        this.router.navigate([this.routes.memberManagement]);
      }
    );
  }
  

  onCancel(): void {
    this.activeModal.dismiss(); // Dismiss modal
  }
}