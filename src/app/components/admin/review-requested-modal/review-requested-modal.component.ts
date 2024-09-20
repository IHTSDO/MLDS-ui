/**
 * Review Requested Modal Component
 *
 * This component is used to display a modal for reviewing a requested application.
 * It provides functionality for approving or dismissing the application.
 *
 * @example
 * <app-review-requested-modal [application]="application"></app-review-requested-modal>
 */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * Review Requested Modal Component
 */
@Component({
  selector: 'app-review-requested-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './review-requested-modal.component.html',
  styleUrl: './review-requested-modal.component.scss'
})
export class ReviewRequestedModalComponent {
  /**
   * The application to be reviewed
   */
  @Input() application: any;

  /**
   * Flag indicating whether the form is submitting
   */
  submitting = false;

  /**
   * Array of alerts to be displayed
   */
  alerts: { type: string, msg: string }[] = [];

  /**
   * Constructor
   *
   * @param activeModal The active modal instance
   * @param userRegistrationService The user registration service
   */
  constructor(
    public activeModal: NgbActiveModal,
    private userRegistrationService: UserRegistrationService
  ) {}

  /**
   * Approve the application
   */
  ok() {
    this.submitting = true;
    this.alerts = [];

    this.userRegistrationService.approveApplication(this.application, 'REVIEW_REQUESTED')
      .subscribe({
        next: () => {
          this.activeModal.close();
        },
        error: () => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [19]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  /**
   * Dismiss the modal
   */
  dismiss() {
    this.activeModal.dismiss();
  }

  /**
   * Close an alert
   *
   * @param alert The alert to be closed
   */
  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }
}