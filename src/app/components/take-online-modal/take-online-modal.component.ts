import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';

@Component({
  selector: 'app-take-online-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-online-modal.component.html',
  styleUrl: './take-online-modal.component.scss'
})
export class TakeOnlineModalComponent {

  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  notify = { notifyAffiliates: false };
  alerts: { type: string, msg: string }[] = [];
  submitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private releaseVersionsService: ReleaseVersionsService
  ) {}

  ok(): void {
    this.submitting = true;
    this.alerts = [];
    this.releaseVersion.releaseType = 'online';
    this.releaseVersionsService.update(this.releasePackage.releasePackageId,this.releaseVersion.releaseVersionId,this.releaseVersion)
    .pipe(
      catchError(error => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [33]: please try again later.' });
        this.submitting = false;
        return of(null);
      })
    )
    .subscribe(updateResult => {
      if (this.notify.notifyAffiliates) {
        this.releaseVersionsService.notify(this.releasePackage.releasePackageId,this.releaseVersion.releaseVersionId, this.releaseVersion)
          .pipe(
            catchError(error => {
              console.warn('Failed to notify affiliates', error);
              return of(null);
            })
          )
          .subscribe(notifyResult => this.activeModal.close(updateResult));
      } else {
        this.activeModal.close(updateResult);
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}
