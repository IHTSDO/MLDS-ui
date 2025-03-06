import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ROUTES } from 'src/app/routes-config';
@Component({
  selector: 'app-show-user-details',
  standalone: true,
  imports: [],
  templateUrl: './show-user-details.component.html',
  styleUrl: './show-user-details.component.scss'
})
export class ShowUserDetailsComponent {
  @Input() userDetails!: any;
  @Input() currentEmail!: string;
  @Input() newEmail!: string;
  @Input() affiliateId!: number; // Pass logged-in user's login
  routes = ROUTES;

  constructor(private toastr: ToastrService,public activeModal: NgbActiveModal, private affiliateService: AffiliateService,private router: Router) {}

  updateAnyway() {
    debugger;
    if (this.currentEmail && this.newEmail) {
      this.affiliateService.updatePrimaryEmail(this.currentEmail, this.newEmail).subscribe(
        (response) => {
          console.log('Email updated successfully:', response);
          this.toastr.success('Primary Email Updated Successfully!', 'Success');
          this.activeModal.close('updateAnyway');
          this.router.navigate([this.routes.affiliateManagement, encodeURIComponent(this.affiliateId)]);
        },
        (error) => {
          console.error('Error updating email:', error);
          this.toastr.error('Failed to update email. Please try again.', 'Error');
          this.router.navigate([this.routes.affiliateManagement, encodeURIComponent(this.affiliateId)]);
        }
      );
    }
  }

  cancel() {
    this.activeModal.close('cancel');
  }
}


