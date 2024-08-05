import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from 'src/app/services/passwordReset/password-reset.service';
import { PasswordStrengthBarComponent } from '../password-strength-bar/password-strength-bar.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, PasswordStrengthBarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  success: string | null = null;
  error: { expired?: boolean, server?: boolean } = {};
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    }, { 
      validator: this.passwordMatchValidator()
    });
  }

  ngOnInit(): void {
 
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password && confirmPassword && password === confirmPassword
        ? null
        : { 'mismatch': true };
    };
  }

  // Form submission handler
  submit(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      if (!this.token) {
        this.error.server = true;
      }
      return;
    }

    const { password } = this.resetPasswordForm.value;

    this.passwordResetService.resetPassword(this.token, password)
      .subscribe({
        next: () => {
          this.success = 'Password changed successfully!';
          this.error = {};
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (response) => {
          this.success = null;
          this.error.server = response.status !== 404;
          this.error.expired = response.status === 404;
        }
      });
  }
}

