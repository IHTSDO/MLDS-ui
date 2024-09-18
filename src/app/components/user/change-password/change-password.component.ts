import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { ChangePasswordService } from 'src/app/services/change-password/change-password.service';
import { PasswordStrengthBarComponent } from "../../common/password-strength-bar/password-strength-bar.component";
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PasswordStrengthBarComponent, TranslateModule, CompareTextPipe],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  success: string | null = null;
  error: string | null = null;
  doNotMatch: boolean = false;
  formDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: ChangePasswordService
  ) {
    this.passwordForm =  this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    }, { 
      validator: this.passwordMatchValidator()
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

  changePassword() {
    
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { password } = this.passwordForm.value;

    this.passwordService.changePassword(password).subscribe(
      () => {
        this.error = null;
        this.success = 'Password changed!';
        this.formDisabled = true; 
      },
      () => {
        this.success = null;
        this.error = 'An error has occurred. The password could not be changed.';
      }
    );
  }
}