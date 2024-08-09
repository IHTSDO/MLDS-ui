import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-license-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-license-modal.component.html',
  styleUrl: './edit-license-modal.component.scss'
})
export class EditLicenseModalComponent {
  @Input() member: any;
  alerts = [];
  submitting = false;

  constructor(public activeModal: NgbActiveModal) {}

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  ok(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.activeModal.close('Upload and Replace');
    }, 2000);
  }
}
