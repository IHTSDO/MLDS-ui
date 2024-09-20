import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * ChangeRequestedModalComponent
 *
 * A modal component that displays a confirmation message to the user when an application change is requested.
 *
 * @example
 * <app-change-requested-modal [application]="application"></app-change-requested-modal>
 */
@Component({
  selector: 'app-change-requested-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './change-requested-modal.component.html',
  styleUrls: ['./change-requested-modal.component.scss']
})
export class ChangeRequestedModalComponent {
  /**
   * The application object that triggered the change request.
   */
  @Input() application: any;

  /**
   * Flag indicating whether the modal is currently submitting a request.
   */
  submitting = false;

  /**
   * Array of alert messages to display to the user.
   */
  alerts: { type: string, msg: string }[] = [];

  /**
   * Constructor
   *
   * @param activeModal The NgbActiveModal instance that manages the modal.
   * @param userRegistrationService The UserRegistrationService instance that handles application approvals.
   */
  constructor(
    public activeModal: NgbActiveModal,
    private userRegistrationService: UserRegistrationService
  ) {}

  /**
   * Ok button click handler.
   *
   * Submits the application approval request and closes the modal on success.
   */
  ok() {
    this.submitting = true;
    this.alerts = [];
    this.activeModal.close();
    this.userRegistrationService.approveApplication(this.application, 'CHANGE_REQUESTED')
      .subscribe({
        next: () => {
          this.activeModal.close();
        },
        error: () => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [20]: please try again later.' });
          this.submitting = false;
        }
      });
  }

  /**
   * Dismiss button click handler.
   *
   * Closes the modal without submitting a request.
   */
  dismiss() {
    this.activeModal.dismiss();
  }

  /**
   * Close alert button click handler.
   *
   * Removes the specified alert message from the alerts array.
   *
   * @param alert The alert message to remove.
   */
  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }
}