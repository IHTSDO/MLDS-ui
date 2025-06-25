import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * PasswordStrengthBarComponent is a component that displays a password strength bar
 * based on the input password.
 *
 * @example
 * <app-password-strength-bar [passwordToCheck]="'mysecretpassword'"></app-password-strength-bar>
 */
@Component({
    selector: 'app-password-strength-bar',
    imports: [],
    templateUrl: './password-strength-bar.component.html',
    styleUrl: './password-strength-bar.component.scss'
})
export class PasswordStrengthBarComponent implements OnChanges {
  /**
   * Input property to receive the password to check.
   *
   * @example
   * <app-password-strength-bar [passwordToCheck]="'mysecretpassword'"></app-password-strength-bar>
   */
  @Input() passwordToCheck: string = '';

  /**
   * The calculated strength of the password (0-5).
   */
  strength: number = 0;

  /**
   * The color of the strength bar based on the password strength.
   */
  strengthColor: string = 'red';

  /**
   * Lifecycle hook that is called when the input properties change.
   *
   * @param changes - The changes to the input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['passwordToCheck']) {
      this.calculateStrength(this.passwordToCheck);
    }
  }

  /**
   * Calculates the strength of the password based on various criteria.
   *
   * @param password - The password to check.
   */
  private calculateStrength(password: string): void {
    const lengthCriteria = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    this.strength = (lengthCriteria ? 1 : 0) +
                    (hasUppercase ? 1 : 0) +
                    (hasLowercase ? 1 : 0) +
                    (hasNumber ? 1 : 0) +
                    (hasSpecialChar ? 1 : 0);

    this.updateStrengthColor();
  }

  /**
   * Updates the strength color based on the calculated strength.
   */
  private updateStrengthColor(): void {
    switch (this.strength) {
      case 5:
        this.strengthColor = 'green';
        break;
      case 4:
        this.strengthColor = 'blue';
        break;
      case 3:
        this.strengthColor = 'orange';
        break;
      default:
        this.strengthColor = 'red';
        break;
    }
  }
}