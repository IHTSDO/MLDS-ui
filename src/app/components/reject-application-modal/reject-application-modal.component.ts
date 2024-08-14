import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';

@Component({
  selector: 'app-reject-application-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reject-application-modal.component.html',
  styleUrl: './reject-application-modal.component.scss'
})
export class RejectApplicationModalComponent {
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

  dismiss() {
    this.activeModal.dismiss();
  }

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}
