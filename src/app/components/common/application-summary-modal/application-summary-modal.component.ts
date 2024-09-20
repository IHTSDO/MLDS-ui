import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationSummaryBlockComponent } from "../application-summary-block/application-summary-block.component";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-application-summary-modal',
  standalone: true,
  imports: [CommonModule, ApplicationSummaryBlockComponent, TranslateModule, CompareTextPipe, ModalComponent],
  templateUrl: './application-summary-modal.component.html',
  styleUrl: './application-summary-modal.component.scss'
})
export class ApplicationSummaryModalComponent {
  @Input() application: any;
  alerts: any[] = [];
  submitting = false;

  constructor(public activeModal: NgbActiveModal) {}

  closeAlert(alert: any): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

}
