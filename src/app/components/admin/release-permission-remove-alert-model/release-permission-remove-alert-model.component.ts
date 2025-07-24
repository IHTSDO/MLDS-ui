import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-release-permission-remove-alert-model',
  imports: [ModalComponent, CommonModule],
  templateUrl: './release-permission-remove-alert-model.component.html',
  styleUrl: './release-permission-remove-alert-model.component.scss'
})
export class ReleasePermissionRemoveAlertModelComponent{

   @Input() message: string = '';

   constructor(public activeModal: NgbActiveModal) {}

   confirm(): void {
    this.activeModal.close(true); 
  }

   cancel(): void {
    this.activeModal.dismiss(false);
  }

}
