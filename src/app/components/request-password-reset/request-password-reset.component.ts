import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { PasswordResetService } from 'src/app/services/passwordReset/password-reset.service';

@Component({
  selector: 'app-request-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.scss'
})
export class RequestPasswordResetComponent implements OnInit{
  passwordResetForm: FormGroup = new FormGroup({});
  alerts: { type: string, msg: string }[] = [];
  resetProcessStarted = false;
  isLoading = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private formBuilder: FormBuilder
  ) {
    this.passwordResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

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
          debugger;
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