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
import { catchError, of } from 'rxjs';

/**
 * Review Requested Modal Component
 */
@Component({
    selector: 'app-review-requested-modal',
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

  constructor(
    public activeModal: NgbActiveModal,
    private userRegistrationService: UserRegistrationService
  ) {}

  /**
   * Approve the application with 'REVIEW_REQUESTED' status
   */
  ok(): void {
    this.submitting = true;
    this.clearAlerts();

    this.userRegistrationService.approveApplication(this.application, 'REVIEW_REQUESTED')
      .pipe(
        catchError(() => this.handleError('Network request failure [19]: please try again later.'))
      )
      .subscribe(result => {
        if (result) {
          this.closeModal();
        }
      });
  }

  /**
   * Dismiss the modal
   */
  dismiss(): void {
    this.activeModal.dismiss();
  }

  /**
   * Close an alert
   *
   * @param alert The alert to be closed
   */
  closeAlert(alert: { type: string, msg: string }): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  /**
   * Close the modal
   */
  private closeModal(): void {
    this.activeModal.close();
  }

  /**
   * Handle errors and display appropriate alert messages
   *
   * @param errorMessage The error message to display
   */
  private handleError(errorMessage: string) {
    this.alerts.push({ type: 'danger', msg: errorMessage });
    this.submitting = false;
    return of(null); // Returning a fallback observable to prevent break in the stream
  }

  /**
   * Clear all alerts
   */
  private clearAlerts(): void {
    this.alerts = [];
  }
}
