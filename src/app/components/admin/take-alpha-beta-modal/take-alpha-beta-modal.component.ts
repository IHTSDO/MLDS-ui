import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
    selector: 'app-take-alpha-beta-modal',
    imports: [CommonModule, ModalComponent],
    templateUrl: './take-alpha-beta-modal.component.html',
    styleUrl: './take-alpha-beta-modal.component.scss'
})
export class TakeAlphaBetaModalComponent {
  /**
   * Input properties for releasePackage and releaseVersion
   */
  @Input() releasePackage: any;
  @Input() releaseVersion: any;

  /**
   * Array of alerts for displaying messages
   */
  alerts: { type: string, msg: string }[] = [];

  /**
   * Flag indicating whether the form is being submitted
   */
  submitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private releaseVersionsService: ReleaseVersionsService
  ) {}

  /**
   * Confirm action to set the release type to 'alpha/beta' and submit the change
   */
  confirm(): void {
    this.submitting = true;
    this.clearAlerts();
    this.releaseVersion.releaseType = 'alpha/beta';
    
    this.releaseVersionsService.update(this.releasePackage.releasePackageId, this.releaseVersion.releaseVersionId, this.releaseVersion)
      .pipe(
        catchError(error => this.handleError('Network request failure [33]: please try again later.'))
      )
      .subscribe(result => {
        if (result) {
          this.closeModal('Confirmed');
        }
      });
  }

  /**
   * Dismiss modal window
   */
  close(): void {
    this.activeModal.dismiss();
  }

  /**
   * Remove a specific alert from the alerts array
   *
   * @param alert The alert to be removed
   */
  closeAlert(alert: { type: string, msg: string }): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  /**
   * Close the modal with a specified result
   *
   * @param result The result to return when closing the modal
   */
  private closeModal(result: string): void {
    this.activeModal.close(result);
  }

  /**
   * Handle errors and display appropriate alert messages
   *
   * @param errorMessage The error message to display
   */
  private handleError(errorMessage: string) {
    this.alerts.push({ type: 'danger', msg: errorMessage });
    this.submitting = false;
    return of(null);
  }

  /**
   * Clear all alerts from the alerts array
   */
  private clearAlerts(): void {
    this.alerts = [];
  }
}
