import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-url-mismatch-warning-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './url-mismatch-warning-modal.component.html',
  styleUrl: './url-mismatch-warning-modal.component.scss'
})
export class UrlMismatchWarningModalComponent {
  @Input() message: string = 'Some link texts in the description do not match their URLs. Do you want to proceed with saving?';

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.dismiss(false);
  }
}
