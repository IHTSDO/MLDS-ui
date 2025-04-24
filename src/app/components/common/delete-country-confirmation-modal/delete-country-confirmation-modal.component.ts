import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-country-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-country-confirmation-modal.component.html',
  styleUrl: './delete-country-confirmation-modal.component.scss'
})
export class DeleteCountryConfirmationModalComponent {
  @Input() isoCode!: string;

  constructor(public activeModal: NgbActiveModal) {}

  confirmDelete(): void {
    this.activeModal.close('confirm');
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}