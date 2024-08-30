import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-release-license-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-release-license-confirm-modal.component.html',
  styleUrl: './edit-release-license-confirm-modal.component.scss'
})
export class EditReleaseLicenseConfirmModalComponent {

  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close('confirmed');
  }

}
