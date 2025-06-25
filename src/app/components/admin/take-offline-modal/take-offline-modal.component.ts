import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, Observable, of } from 'rxjs';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
    selector: 'app-take-offline-modal',
    imports: [CommonModule, ModalComponent],
    templateUrl: './take-offline-modal.component.html',
    styleUrl: './take-offline-modal.component.scss'
})
export class TakeOfflineModalComponent {
  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  
  alerts: { type: string, msg: string }[] = [];
  submitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private releaseVersionsService: ReleaseVersionsService
  ) {}

  // Confirm action to take release offline
  confirm(): void {
    this.submitting = true;
    this.clearAlerts();
    this.releaseVersion.releaseType = 'offline';

    this.releaseVersionsService.update(this.releasePackage.releasePackageId, this.releaseVersion.releaseVersionId, this.releaseVersion)
      .pipe(catchError(this.handleError.bind(this))) // Use bind to retain the correct context
      .subscribe(result => this.handleSuccess(result));
  }

  // Handle modal success response
  private handleSuccess(result: any): void {
    if (result) {
      this.closeModal('Confirmed');
    }
  }

  // Error handling for network failures
  private handleError(error: any): Observable<null> {
    this.addAlert('danger', 'Network request failure [33]: please try again later.');
    this.submitting = false;
    return of(null);
  }

  // Add an alert message
  private addAlert(type: string, msg: string): void {
    this.alerts.push({ type, msg });
  }

  // Clear all alerts
  private clearAlerts(): void {
    this.alerts = [];
  }

  // Close the active modal with a result
  private closeModal(result: string): void {
    this.activeModal.close(result);
  }

  // Close the active modal without a result
  close(): void {
    this.activeModal.dismiss();
  }

  // Close a specific alert
  closeAlert(alert: { type: string, msg: string }): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }
}
