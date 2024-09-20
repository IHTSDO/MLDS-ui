import { Component, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Modal component that can be used to display a modal window.
 *
 * Example:
 * ```
 * <app-modal id="my-modal" size="large">
 *   <!-- modal content here -->
 * </app-modal>
 * ```
 */
@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [FormsModule,ReactiveFormsModule,CommonModule],
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent {
      // Inputs to customize the modal
  @Input() title: string = ''; // The title of the modal
  @Input() formGroup: FormGroup | null = null; // FormGroup for forms inside the modal
  @Input() submitText: string = 'Submit'; // Submit button text
  @Input() cancelText: string = 'Cancel'; // Cancel button text
  @Input() alerts: any[] = []; // Any alerts to be shown
  @Input() isSubmitting: boolean = false; // Whether form submission is in progress
  @Input() showForm: boolean = true; // Flag to show/hide form
  @Input() buttonDisabled:boolean=false;
  @Input() buttonType: 'default' | 'delete' = 'default'; 
  @Input() iconClass: string = '';
  // Outputs to communicate actions back to parent components
  @Output() onSubmit: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();

  // Method to handle submit
  submit() {
    if (this.formGroup && this.formGroup.valid) {
      this.onSubmit.emit();
    } else {
      this.onSubmit.emit();
    }
  }
  

  // Method to handle cancel
  cancel() {
    this.onCancel.emit();
  }

  // Method to close alerts
  closeAlert(index: number) {
    this.alerts.splice(index, 1);
  }
}