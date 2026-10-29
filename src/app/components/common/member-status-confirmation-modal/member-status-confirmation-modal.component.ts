import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-member-status-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-status-confirmation-modal.component.html',
  styleUrls: ['./member-status-confirmation-modal.component.scss'],
})
export class MemberStatusConfirmationModalComponent {

  @Input() memberKey = '';
  @Input() memberActive = false;

  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close(true);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}