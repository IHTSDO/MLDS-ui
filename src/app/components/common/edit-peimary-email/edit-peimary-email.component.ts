import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ShowUserDetailsComponent } from '../show-user-details/show-user-details.component';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/routes-config';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-peimary-email',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './edit-peimary-email.component.html',
    styleUrl: './edit-peimary-email.component.scss'
})
export class EditPeimaryEmailComponent {
 
    @Input() currentEmail!: string;
    @Input() affiliateDetailsId!: number;
    @Input() affiliateId!: number;
    login!: string; // Store logged-in user login
    emailForm: FormGroup;
    routes = ROUTES;
  
    constructor(
      private toastr: ToastrService,
      public activeModal: NgbActiveModal,
      private affiliateService: AffiliateService,
      private authService: AuthenticationSharedService, private modalService: NgbModal,private router: Router
    ) {
      // Initialize form with validators
      this.emailForm = new FormGroup({
        newEmail: new FormControl('', [Validators.required, Validators.email]),
      });
    }
    updateEmail() {
      if (this.emailForm.valid) {
        const email = this.emailForm.value.newEmail;
        this.getUserDetails(email); // Call only when button is clicked
      }
    }

  
    getUserDetails(email: string) {
      this.affiliateService.getUserDetails(email, this.affiliateDetailsId).subscribe(
        (data) => {
          console.log('User Details:', data);
          if (data.affiliateDetails) {
            this.showUserDetailsPopup(data);
          } else {
            // Handle empty response
            console.warn('No affiliate details found.');
            this.updateEmailProcess(); // Continue the email update process
          }
        },
        (error) => console.error('Error fetching user details:', error)
      );
    }

    showUserDetailsPopup(userDetails: any) {
      const modalRef = this.modalService.open(ShowUserDetailsComponent, { centered: true });
      modalRef.componentInstance.userDetails = userDetails; // Pass user details
      modalRef.componentInstance.currentEmail = this.currentEmail; // Pass current email
      modalRef.componentInstance.newEmail = this.emailForm.value.newEmail; // Pass new email
      modalRef.componentInstance.affiliateId = this.affiliateId; // Pass login
    
      modalRef.result.then(
        (action) => {
          if (action === 'updateAnyway') {
            console.log('Email updated successfully'); // Success log
          } else if (action === 'cancel') {
            this.router.navigate([this.routes.affiliateManagement, encodeURIComponent(this.affiliateId)]);
          }
        },
        () => {} // Handle dismiss
      );
    }
    
    
  
    updateEmailProcess() {
      if (this.emailForm.valid && this.currentEmail) {
        const newEmail = this.emailForm.value.newEmail;
        this.affiliateService.updatePrimaryEmail(this.currentEmail, newEmail).subscribe(
          (response) => {
            console.log('Email updated successfully:', response);
            this.toastr.success('Primary Email Updated Successfully!', 'Success');
            this.activeModal.close(newEmail); // Close modal & pass updated email
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
  }
  