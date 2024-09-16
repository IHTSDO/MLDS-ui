import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Exclusion modal component.
 *
 * This component is used to display a modal dialog for excluding a country from a registration process.
 *
 * @example
 * <app-exclusion-modal [countryName]="'United States'" [urlRegistration]="'https://example.com/register'"></app-exclusion-modal>
 */
@Component({
  selector: 'app-exclusion-modal',
  standalone: true,
  imports: [],
  templateUrl: './exclusion-modal.component.html',
  styleUrls: ['./exclusion-modal.component.scss']
})
export class ExclusionModalComponent {
  /**
   * The name of the country to be excluded.
   *
   * @example 'United States'
   */
  @Input() countryName: string | null = null;

  /**
   * The URL for registration.
   *
   * @example 'https://example.com/register'
   */
  @Input() urlRegistration: string | null = null;

  /**
   * Creates an instance of the exclusion modal component.
   *
   * @param activeModal The active modal instance.
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Confirms the exclusion and closes the modal.
   */
  confirm(): void {
    this.activeModal.close(true);
  }

  /**
   * Cancels the exclusion and dismisses the modal.
   */
  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}