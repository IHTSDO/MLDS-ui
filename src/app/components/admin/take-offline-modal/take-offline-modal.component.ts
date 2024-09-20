import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-take-offline-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './take-offline-modal.component.html',
  styleUrl: './take-offline-modal.component.scss'
})
export class TakeOfflineModalComponent {

  @Input() releasePackage:any;
  @Input() releaseVersion:any;
  alerts: { type: string, msg: string }[] = [];
  submitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private releaseVersionsService: ReleaseVersionsService
  ) {}

  confirm(): void {
    this.submitting = true;
    this.alerts = [];
    this.releaseVersion.releaseType = 'offline';
    this.releaseVersionsService.update(this.releasePackage.releasePackageId,this.releaseVersion.releaseVersionId,this.releaseVersion)
    .pipe(
      catchError(error => {
        this.alerts.push({ type: 'danger', msg: 'Network request failure [33]: please try again later.' });
        this.submitting = false;
        return of(null);
      })
    )
    .subscribe(result => {
      if(result) {
        this.activeModal.close('Confirmed');
      }
    }) 
  }

  close(): void {
    this.activeModal.dismiss();
  }

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }


}
