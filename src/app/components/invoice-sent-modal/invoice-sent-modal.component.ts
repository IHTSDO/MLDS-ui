import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-sent-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-sent-modal.component.html',
  styleUrl: './invoice-sent-modal.component.scss'
})
export class InvoiceSentModalComponent {
  @Input() affiliate: any;
  submitting = false;
  alerts: { type: string; msg: string }[] = [];

  constructor(private activeModal: NgbActiveModal) { }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  markAsSent(): void {
    this.activeModal.close(true);
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

}
