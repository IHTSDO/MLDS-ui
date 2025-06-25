import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-release-config-warning-modal',
    imports: [CommonModule, ModalComponent],
    templateUrl: './release-config-warning-modal.component.html',
    styleUrl: './release-config-warning-modal.component.scss'
})
export class ReleaseConfigWarningModalComponent {


  constructor(
    public activeModal: NgbActiveModal,
  ) { }


  dismiss() {
    this.activeModal.dismiss();
  }

  ok() {
    this.activeModal.close(true);
  }

}
