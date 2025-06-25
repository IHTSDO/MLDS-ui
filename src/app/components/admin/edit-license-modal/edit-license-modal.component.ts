import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * Edit License Modal Component
 *
 * A modal component for editing a license.
 *
 * @example
 * <app-edit-license-modal [member]="member"></app-edit-license-modal>
 */
@Component({
    selector: 'app-edit-license-modal',
    imports: [CommonModule, TranslateModule, ModalComponent],
    templateUrl: './edit-license-modal.component.html',
    styleUrls: ['./edit-license-modal.component.scss']
})
export class EditLicenseModalComponent {
  /**
   * The member object to be edited.
   *
   * @example
   * { id: 1, name: 'John Doe', license: 'ABC123' }
   */
  @Input() member: any;

  /**
   * An array of alerts to be displayed in the modal.
   */
  alerts = [];

  /**
   * A flag indicating whether the modal is submitting.
   */
  submitting = false;

  /**
   * Constructor
   *
   * @param activeModal The active modal instance.
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Close an alert by index.
   *
   * @param index The index of the alert to close.
   */
  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  /**
   * Ok button click handler.
   *
   * Simulates a submission process and closes the modal after 2 seconds.
   */
  ok(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.activeModal.close('Upload and Replace');
    }, 2000);
  }
}