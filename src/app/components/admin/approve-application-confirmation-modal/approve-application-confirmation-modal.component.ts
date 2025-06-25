import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * Approve Application Confirmation Modal Component
 *
 * This component is used to display a confirmation modal for approving an application.
 *
 * @example
 * <app-approve-application-confirmation-modal [application]="application"></app-approve-application-confirmation-modal>
 */
@Component({
    selector: 'app-approve-application-confirmation-modal',
    imports: [CommonModule, ModalComponent],
    templateUrl: './approve-application-confirmation-modal.component.html',
    styleUrls: ['./approve-application-confirmation-modal.component.scss']
})
export class ApproveApplicationConfirmationModalComponent {
  /**
   * The application to be approved
   *
   * @example
   * {
   *   id: 1,
   *   name: 'John Doe',
   *   email: 'johndoe@example.com'
   * }
   */
  @Input() application: any;

  /**
   * Flag indicating whether the modal is submitting
   */
  submitting = false;

  /**
   * Array of alerts to be displayed
   *
   * @example
   * [
   *   { type: 'success', msg: 'Application approved successfully' },
   *   { type: 'error', msg: 'Error approving application' }
   * ]
   */
  alerts: { type: string, msg: string }[] = [];

  /**
   * Constructor
   *
   * @param activeModal - The active modal instance
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
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
   * @param alert - The alert to be closed
   */
  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }
}