import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from 'src/app/services/passwordReset/password-reset.service';
import { PasswordStrengthBarComponent } from '../password-strength-bar/password-strength-bar.component';
import { ROUTES } from 'src/app/routes-config'

/**
 * Component for resetting a user's password.
 * 
 * @example
 * <app-reset-password></app-reset-password>
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PasswordStrengthBarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  /**
   * Form group for the password reset form.
   */
  resetPasswordForm: FormGroup;

  /**
   * Success message to display after a successful password reset.
   */
  success: string | null = null;

  /**
   * Error object to display error messages.
   */
  error: { expired?: boolean, server?: boolean } = {};

  /**
   * Token for the password reset request.
   */
  token: string | null = null;

  /**
   * Routes configuration.
   */
  routes = ROUTES;

  /**
   * Constructor for the component.
   * 
   * @param fb Form builder for creating the form group.
   * @param passwordResetService Service for resetting passwords.
   * @param route Activated route for getting the token from the query parameters.
   * @param router Router for navigating to the login page after a successful password reset.
   */
  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    /**
     * Create the form group with the password and confirm password fields.
     */
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    }, { 
      validator: this.passwordMatchValidator()
    });
  }

  /**
   * Lifecycle hook for when the component is initialized.
   */
  ngOnInit(): void {
 
    /**
     * Get the token from the query parameters.
     */
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  /**
   * Validator function to check if the password and confirm password fields match.
   * 
   * @returns A validator function that returns an error object if the fields do not match.
   */
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password && confirmPassword && password === confirmPassword
        ? null
        : { 'mismatch': true };
    };
  }

  /**
   * Handler for the form submission.
   */
  submit(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      if (!this.token) {
        this.error.server = true;
      }
      return;
    }

    const { password } = this.resetPasswordForm.value;

    /**
     * Call the password reset service to reset the password.
     */
    this.passwordResetService.resetPassword(this.token, password)
      .subscribe({
        next: () => {
          this.success = 'Password changed successfully!';
          this.error = {};
          setTimeout(() => this.router.navigate([this.routes.login]), 2000);
        },
        error: (response) => {
          this.success = null;
          this.error.server = response.status !== 404;
          this.error.expired = response.status === 404;
        }
      });
  }
}