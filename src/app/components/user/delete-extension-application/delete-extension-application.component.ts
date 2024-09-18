import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

@Component({
  selector: 'app-delete-extension-application',
  standalone: true,
  imports: [TranslateModule, CompareTextPipe],
  templateUrl: './delete-extension-application.component.html',
  styleUrl: './delete-extension-application.component.scss'
})
export class DeleteExtensionApplicationComponent {
  constructor(public activeModal: NgbActiveModal) {}

  confirmCancel() {
    this.activeModal.close('confirmed');
  }

  cancelCancel() {
    this.activeModal.dismiss('cancelled');
  }
}
