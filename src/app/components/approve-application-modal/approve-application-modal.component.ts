import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of } from 'rxjs';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';

@Component({
  selector: 'app-approve-application-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-application-modal.component.html',
  styleUrl: './approve-application-modal.component.scss'
})
export class ApproveApplicationModalComponent {
  @Input() application: any;
  submitting = false;
  alerts: { type: string, msg: string }[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private userRegistrationService: UserRegistrationService
  ) {}

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

  dismiss() {
    this.activeModal.dismiss();
  }

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }


}
