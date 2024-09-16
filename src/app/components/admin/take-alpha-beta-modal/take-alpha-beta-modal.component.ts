import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';

@Component({
  selector: 'app-take-alpha-beta-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-alpha-beta-modal.component.html',
  styleUrl: './take-alpha-beta-modal.component.scss'
})
export class TakeAlphaBetaModalComponent {

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
    this.releaseVersion.releaseType = 'alpha/beta';
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
