import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of } from 'rxjs';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';

/**
 * Approve Application Modal Component
 *
 * This component is used to display a modal for approving an application.
 * It takes an `application` input and provides buttons for approving or dismissing the application.
 *
 * @example
 * <app-approve-application-modal [application]="application"></app-approve-application-modal>
 */
@Component({
  selector: 'app-approve-application-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-application-modal.component.html',
  styleUrls: ['./approve-application-modal.component.scss']
})
export class ApproveApplicationModalComponent {
  /**
   * The application to be approved
   */
  @Input() application: any;

  /**
   * Flag indicating whether the approval request is being submitted
   */
  submitting = false;

  /**
   * Array of alerts to be displayed to the user
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
   *
   * Submits the approval request to the server and closes the modal on success.
   * Displays an error alert on failure.
   */
  ok() {
    this.submitting = true;
    this.alerts = [];

    this.userRegistrationService.approveApplication(this.application, 'APPROVED')
      .pipe(
        finalize(() => this.submitting = false),
        catchError(() => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [4]: please try again later.' });
          return of();
        })
      )
      .subscribe(() => this.activeModal.close());
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