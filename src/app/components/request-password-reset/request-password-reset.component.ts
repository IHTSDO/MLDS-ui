import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { PasswordResetService } from 'src/app/services/passwordReset/password-reset.service';

/**
 * Request Password Reset Component
 *
 * This component allows users to request a password reset by entering their email address.
 */
@Component({
  selector: 'app-request-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.scss'
})
export class RequestPasswordResetComponent implements OnInit {
  /**
   * The password reset form
   */
  passwordResetForm: FormGroup = new FormGroup({});

  /**
   * Alerts to display to the user
   */
  alerts: { type: string, msg: string }[] = [];

  /**
   * Flag indicating whether the password reset process has started
   */
  resetProcessStarted = false;

  /**
   * Flag indicating whether the component is currently loading
   */
  isLoading = false;

  constructor(
    /**
     * Password Reset Service
     */
    private passwordResetService: PasswordResetService,
    /**
     * Form Builder
     */
    private formBuilder: FormBuilder
  ) {
    this.passwordResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Initialize the component
   */
  ngOnInit(): void {}

  /**
   * Request a password reset email
   *
   * @example
   * <button (click)="requestResetEmail()">Request Password Reset</button>
   */
  requestResetEmail(): void {
    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.alerts = [];

    const email = this.passwordResetForm.value.email;

    this.passwordResetService.requestResetEmail(email)
      .pipe(
        switchMap(response => {
          if (response) {
            this.alerts.push({ type: 'success', msg: 'Password reset process started, please check your email.' });
            this.resetProcessStarted = true;
          }
          return of(response);
        }),
        catchError(error => {
          this.alerts.push({ type: 'danger', msg: 'Email not found.' });
          console.error('Error sending reset email:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}