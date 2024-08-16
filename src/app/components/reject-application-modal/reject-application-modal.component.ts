import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';

/**
 * Reject Application Modal Component
 *
 * This component is used to display a modal window for rejecting a user application.
 *
 * @example
 * <app-reject-application-modal [application]="application"></app-reject-application-modal>
 */
@Component({
  selector: 'app-reject-application-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reject-application-modal.component.html',
  styleUrl: './reject-application-modal.component.scss'
})
export class RejectApplicationModalComponent {
  /**
   * The application object to be rejected
   */
  @Input() application: any;

  /**
   * Flag indicating whether the form is being submitted
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
   * OK button click handler
   *
   * Submits the rejection request to the server
   */
  ok() {
    this.submitting = true;
    this.alerts = [];

    this.userRegistrationService.approveApplication(this.application, 'REJECTED')
      .subscribe({
        next: () => {
          this.activeModal.close();
        },
        error: () => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [32]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  /**
   * Dismiss button click handler
   *
   * Closes the modal window
   */
  dismiss() {
    this.activeModal.dismiss();
  }

  /**
   * Close alert button click handler
   *
   * Removes the alert from the array
   *
   * @param alert The alert to be removed
   */
  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}