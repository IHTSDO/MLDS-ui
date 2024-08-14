import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approve-application-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-application-confirmation-modal.component.html',
  styleUrl: './approve-application-confirmation-modal.component.scss'
})
export class ApproveApplicationConfirmationModalComponent {

  @Input() application: any;
  submitting = false;
  alerts: { type: string, msg: string }[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  closeAlert(alert: { type: string, msg: string }) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}
