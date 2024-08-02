import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exclusion-modal',
  standalone: true,
  imports: [],
  templateUrl: './exclusion-modal.component.html',
  styleUrl: './exclusion-modal.component.scss'
})
export class ExclusionModalComponent {

  @Input() countryName: string | null = null;
  @Input() urlRegistration: string | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close(true);
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

}
