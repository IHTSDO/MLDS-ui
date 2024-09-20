import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-create-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './create-login-modal.component.html',
  styleUrl: './create-login-modal.component.scss'
})
export class CreateLoginModalComponent implements OnInit {

  @Input() affiliate: any;
  @Input() reason: { noEmail?: string; duplicateEmail?: string } = {};

  submitAttempted = false;
  oldEmail: string | undefined;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.oldEmail = this.affiliate?.affiliateDetails?.email;
  }

  confirm(form: NgForm) {
    if (form.invalid) {
      this.submitAttempted = true;
      return;
    }

    this.activeModal.close();
  }

}
