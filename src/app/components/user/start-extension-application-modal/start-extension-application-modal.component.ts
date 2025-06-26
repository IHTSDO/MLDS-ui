import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { ModalComponent } from "../../common/modal/modal.component";

@Component({
    selector: 'app-start-extension-application-modal',
    imports: [CommonModule, TranslateModule, CompareTextPipe, ModalComponent],
    templateUrl: './start-extension-application-modal.component.html',
    styleUrl: './start-extension-application-modal.component.scss'
})
export class StartExtensionApplicationModalComponent {
@Input() releasePackage: any; // Receive data passed to modal
submitting = false;
alerts: { type: string; msg: string }[] = [];

constructor(
  public activeModal: NgbActiveModal,
  private userRegistrationService: UserRegistrationService // Service to handle API call
) {}

ok(): void {
  this.submitting = true;
  this.alerts = [];

  // Call the service to create an extension application
  this.userRegistrationService.createExtensionApplication(this.releasePackage.member)
    .subscribe(
      {next:
      (result: any) => {
        // Close the modal and pass the result back to the parent component
        this.activeModal.close(result);
      },
      error:(error: any) => {
        // Handle error and show an alert
        this.alerts.push({ type: 'danger', msg: 'Network request failure: please try again later.' });
        this.submitting = false;
      }
});
}


// Dismiss the modal without performing any action
dismiss(): void {
  this.activeModal.dismiss();
}
}