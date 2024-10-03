import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { ModalComponent } from '../../common/modal/modal.component';
import { CommonModule } from '@angular/common';

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
  imports: [TranslateModule,CompareTextPipe,ModalComponent,CommonModule],
  templateUrl: './exclusion-modal.component.html',
  styleUrls: ['./exclusion-modal.component.scss']
})
export class ExclusionModalComponent implements OnInit{
  /**
   * The name of the country to be excluded.
   *
   * @example 'United States'
   */
  @Input() countryName: string | null = null;
  submitText = '';
  /**
   * The URL for registration.
   *
   * @example 'https://example.com/register'
   */
  @Input() urlRegistration: string | null = null;
isSubmitting: boolean=false;

  /**
   * Creates an instance of the exclusion modal component.
   *
   * @param activeModal The active modal instance.
   */
  constructor(public activeModal: NgbActiveModal,private translate: TranslateService) {}
  ngOnInit(): void {
    const acceptText = this.translate.instant('register.messages.excludemessage.accept');
    this.submitText = `${acceptText} ${this.countryName}`;
  }
  /**
   * Confirms the exclusion and closes the modal.
   */
  confirm(): void {
    this.activeModal.close(true);
    this.isSubmitting=true;
  }

  /**
   * Cancels the exclusion and dismisses the modal.
   */
  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}